import type { Context } from "hono";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Connection } from "../models/connection.js";
import { User } from "../models/user.js";
import { Types, startSession } from "mongoose";
import { validateObjectId } from "../lib/utils/valideObjectId.js";

export const sendRequest = async (c: Context) => {
  const { receiverId } = c.req.param();
  const requesterId = c.get("user").id;

  if (requesterId === receiverId) {
    return sendResponse(c, 400, "Kendini takip edemezsin.");
  }

  if (!validateObjectId(requesterId) || !validateObjectId(receiverId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const existingRequest = await Connection.findOne({
    requester: requesterId,
    receiver: receiverId,
  });

  if (existingRequest) {
    return sendResponse(
      c,
      400,
      "Bu kullanıcıya zaten bir takip isteği gönderdiniz."
    );
  }

  const newRequest = new Connection({
    requester: requesterId,
    receiver: receiverId,
    status: "pending",
  });

  await newRequest.save();
  return sendResponse(c, 200, "Takip isteği gönderildi.");
};

export const acceptRequest = async (c: Context) => {
  const { requestId } = c.req.param();
  const userId = c.get("user").id;

  if (!validateObjectId(requestId) || !validateObjectId(userId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const session = await startSession();
  session.startTransaction();

  try {
    const request = await Connection.findById(requestId).session(session);
    if (!request) {
      return sendResponse(c, 404, "Takip isteği bulunamadı.");
    }

    if (
      request.receiver.toString() !== userId ||
      request.status !== "pending"
    ) {
      return sendResponse(
        c,
        400,
        "Bu isteği kabul edemezsiniz veya zaten işlem yapılmış."
      );
    }

    const [user, requester] = await Promise.all([
      User.findById(userId).session(session),
      User.findById(request.requester).session(session),
    ]);

    if (!user || !requester) throw new Error("Kullanıcı bulunamadı");

    user.followers.push(request.requester);
    requester.following.push(userId);
    request.status = "accepted";

    await Promise.all([
      user.save({ session }),
      requester.save({ session }),
      request.save({ session }),
    ]);
    await session.commitTransaction();

    return sendResponse(c, 200, "Takip isteği kabul edildi.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu.");
  } finally {
    session.endSession();
  }
};

export const rejectRequest = async (c: Context) => {
  const { requestId } = c.req.param();
  const userId = c.get("user").id;

  if (!validateObjectId(requestId) || !validateObjectId(userId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const request = await Connection.findById(requestId);
  if (
    !request ||
    request.receiver.toString() !== userId ||
    request.status !== "pending"
  ) {
    return sendResponse(c, 400, "İstek bulunamadı veya işlem yapılamaz.");
  }

  request.status = "rejected";
  await request.save();
  return sendResponse(c, 200, "Takip isteği reddedildi.");
};

export const unfollow = async (c: Context) => {
  const { userId } = c.req.param();
  const currentUserId = c.get("user").id;

  if (
    userId === currentUserId ||
    !validateObjectId(userId) ||
    !validateObjectId(currentUserId)
  ) {
    return sendResponse(c, 400, "Geçersiz işlem.");
  }

  const session = await startSession();
  session.startTransaction();

  try {
    const currentUser = await User.findById(currentUserId).session(session);
    const userToUnfollow = await User.findById(userId).session(session);

    if (
      !currentUser ||
      !userToUnfollow ||
      !currentUser.following.includes(userToUnfollow._id as Types.ObjectId)
    ) {
      return sendResponse(c, 400, "Takip edilmiyor veya işlem geçersiz.");
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    await Promise.all([
      currentUser.save({ session }),
      userToUnfollow.save({ session }),
    ]);
    await session.commitTransaction();
    return sendResponse(c, 200, "Takipten çıkıldı.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu.");
  } finally {
    session.endSession();
  }
};

export const removeFollower = async (c: Context) => {
  const { userId } = c.req.param();
  const currentUserId = c.get("user").id;

  if (
    userId === currentUserId ||
    !validateObjectId(userId) ||
    !validateObjectId(currentUserId)
  ) {
    return sendResponse(c, 400, "Geçersiz işlem.");
  }

  const session = await startSession();
  session.startTransaction();

  try {
    const currentUser = await User.findById(currentUserId).session(session);
    const follower = await User.findById(userId).session(session);

    if (
      !currentUser ||
      !follower ||
      !currentUser.followers.includes(follower._id as Types.ObjectId)
    ) {
      return sendResponse(c, 400, "Takipçi bulunamadı veya işlem geçersiz.");
    }

    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== userId
    );
    follower.following = follower.following.filter(
      (id) => id.toString() !== currentUserId
    );

    await Promise.all([
      currentUser.save({ session }),
      follower.save({ session }),
    ]);
    await session.commitTransaction();
    return sendResponse(c, 200, "Takipçi silindi.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu.");
  } finally {
    session.endSession();
  }
};

export const getRequests = async (c: Context) => {
  const userId = c.get("user").id;

  const requests = await Connection.find({
    $or: [{ requester: userId }, { receiver: userId }],
  }).populate("requester receiver");

  return sendResponse(c, 200, "Takip istekleri", requests);
};

export const getFollowing = async (c: Context) => {
  const { userId } = c.req.param();

  const user = await User.findById(userId).populate("following");
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Takip edilenler", user.following);
};

export const getFollowers = async (c: Context) => {
  const { userId } = c.req.param();

  const user = await User.findById(userId).populate("followers");
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Takipçiler", user.followers);
};
