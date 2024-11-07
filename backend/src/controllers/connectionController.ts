import type { Context } from "hono";
import { sendResponse } from "../lib/sendResponse.js";
import { Connection } from "../models/connection.js";
import { User, type IUser } from "../models/user.js";
import { Types, startSession } from "mongoose";

export const sendRequest = async (c: Context) => {
  const { receiverId } = c.req.param();
  const requesterId = c.get("user").id;

  if (requesterId === receiverId) {
    return sendResponse(c, 400, "Kendini takip edemezsin.");
  }

  if (
    !Types.ObjectId.isValid(requesterId) ||
    !Types.ObjectId.isValid(receiverId)
  ) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const existingRequest = await Connection.findOne({
    requester: new Types.ObjectId(requesterId),
    receiver: new Types.ObjectId(receiverId),
  });

  if (existingRequest) {
    return sendResponse(
      c,
      400,
      "Bu kullanıcıya zaten bir takip isteği gönderdiniz."
    );
  }

  const newRequest = new Connection({
    requester: new Types.ObjectId(requesterId),
    receiver: new Types.ObjectId(receiverId),
    status: "pending",
  });

  await newRequest.save();
  return sendResponse(c, 200, "Takip isteği gönderildi.");
};

export const acceptRequest = async (c: Context) => {
  const { requestId } = c.req.param();
  const userId = c.get("user").id;

  const request = await Connection.findById(requestId);
  if (!request) {
    return sendResponse(c, 404, "Takip isteği bulunamadı.");
  }

  if (request.receiver.toString() !== userId) {
    return sendResponse(c, 403, "Bu isteği kabul etme yetkiniz yok.");
  }

  if (request.status !== "pending") {
    return sendResponse(
      c,
      400,
      "Bu isteği zaten kabul ettiniz veya reddettiniz."
    );
  }

  const session = await startSession();
  session.startTransaction();

  try {
    request.status = "accepted";
    await request.save({ session });

    const [user, requester] = await Promise.all([
      User.findById(userId).session(session),
      User.findById(request.requester).session(session),
    ]);

    if (user && requester) {
      user.followers.push(new Types.ObjectId(request.requester));
      requester.following.push(new Types.ObjectId(userId));

      await Promise.all([user.save({ session }), requester.save({ session })]);
    }

    await session.commitTransaction();
    return sendResponse(c, 200, "Takip isteği kabul edildi.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu, lütfen tekrar deneyin.");
  } finally {
    session.endSession();
  }
};

export const rejectRequest = async (c: Context) => {
  const { requestId } = c.req.param();
  const userId = c.get("user").id;

  const request = await Connection.findById(requestId);
  if (!request) {
    return sendResponse(c, 404, "Takip isteği bulunamadı.");
  }

  if (request.receiver.toString() !== userId) {
    return sendResponse(c, 403, "Bu isteği reddetme yetkiniz yok.");
  }

  if (request.status !== "pending") {
    return sendResponse(
      c,
      400,
      "Bu isteği zaten kabul ettiniz veya reddettiniz."
    );
  }

  request.status = "rejected";
  await request.save();
  return sendResponse(c, 200, "Takip isteği reddedildi.");
};

export const unfollow = async (c: Context) => {
  const { userId } = c.req.param();
  const currentUserId = c.get("user").id;

  if (userId === currentUserId) {
    return sendResponse(c, 400, "Kendini takipten çıkamazsın.");
  }

  if (
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(currentUserId)
  ) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const currentUser = await User.findById(currentUserId);
  if (
    !currentUser ||
    !currentUser.following.includes(new Types.ObjectId(userId))
  ) {
    return sendResponse(c, 400, "Bu kullanıcıyı takip etmiyorsunuz.");
  }

  const session = await startSession();
  session.startTransaction();

  try {
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userId
    );
    await currentUser.save({ session });

    const userToUnfollow = await User.findById(userId);
    if (userToUnfollow) {
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== currentUserId
      );
      await userToUnfollow.save({ session });
    }

    await session.commitTransaction();
    return sendResponse(c, 200, "Takipten çıkıldı.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu, lütfen tekrar deneyin.");
  } finally {
    session.endSession();
  }
};

export const removeFollower = async (c: Context) => {
  const { userId } = c.req.param();
  const currentUserId = c.get("user").id;

  if (userId === currentUserId) {
    return sendResponse(c, 400, "Kendinizi takipçinizden çıkaramazsınız.");
  }

  if (
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(currentUserId)
  ) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const currentUser = await User.findById(currentUserId);
  if (
    !currentUser ||
    !currentUser.followers.includes(new Types.ObjectId(userId))
  ) {
    return sendResponse(c, 400, "Bu kişi sizi takip etmiyor.");
  }

  const session = await startSession();
  session.startTransaction();

  try {
    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== userId
    );
    await currentUser.save({ session });

    const follower = await User.findById(userId);
    if (follower) {
      follower.following = follower.following.filter(
        (id) => id.toString() !== currentUserId
      );
      await follower.save({ session });
    }

    await session.commitTransaction();
    return sendResponse(c, 200, "Takipçi silindi.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu, lütfen tekrar deneyin.");
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
  const userId = c.get("user").id;

  const user = await User.findById(userId).populate("following");
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Takip edilenler", user.following);
};

export const getFollowers = async (c: Context) => {
  const userId = c.get("user").id;

  const user = await User.findById(userId).populate("followers");
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Takipçiler", user.followers);
};
