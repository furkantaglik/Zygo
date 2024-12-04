import { sendResponse } from "../lib/utils/sendResponse.js";
import { Connection } from "../models/connection.js";
import { User } from "../models/user.js";
import { Types, startSession } from "mongoose";
import { validateObjectId } from "../lib/utils/valideObjectId.js";
import type { Context } from "hono";

export const sendRequest = async (c: Context) => {
  const { receiverId } = c.req.param();
  const requesterId = c.get("user").id;

  if (!validateObjectId(requesterId) || !validateObjectId(receiverId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  if (requesterId === receiverId) {
    return sendResponse(c, 400, "Kendini takip edemezsin.");
  }

  const [receiver, isAlreadyFollowing] = await Promise.all([
    User.findById(receiverId),
    User.exists({ _id: receiverId, followers: requesterId }),
  ]);

  if (!receiver) return sendResponse(c, 404, "Kullanıcı bulunamadı.");

  if (isAlreadyFollowing) {
    return sendResponse(c, 400, "Zaten takip ediyorsunuz.");
  }

  const session = await startSession();
  session.startTransaction();

  try {
    if (receiver.private === false) {
      await Promise.all([
        User.findByIdAndUpdate(
          requesterId,
          {
            $push: { following: receiverId },
            $pull: { sentRequests: receiverId },
          },
          { session }
        ),
        User.findByIdAndUpdate(
          receiverId,
          {
            $push: { followers: requesterId },
            $pull: { receivedRequests: requesterId },
          },
          { session }
        ),
        Connection.findOneAndUpdate(
          { requester: requesterId, receiver: receiverId },
          { status: "accepted" },
          { upsert: true, session }
        ),
      ]);

      await session.commitTransaction();
      return sendResponse(
        c,
        200,
        "Kullanıcı başarıyla takip edildi ve bağlantı kabul edildi."
      );
    }

    const existingRequest = await Connection.findOne({
      requester: requesterId,
      receiver: receiverId,
      status: "pending",
    }).session(session);

    if (existingRequest) {
      await Connection.findByIdAndUpdate(
        existingRequest._id,
        { status: "pending" },
        { session }
      );
      await session.commitTransaction();
      return sendResponse(
        c,
        200,
        "Takip isteği zaten var, durumu güncellendi."
      );
    }

    const newRequest = new Connection({
      requester: requesterId,
      receiver: receiverId,
      status: "pending",
    });

    await Promise.all([
      newRequest.save({ session }),
      User.findByIdAndUpdate(
        requesterId,
        { $push: { sentRequests: receiverId } },
        { session }
      ),
      User.findByIdAndUpdate(
        receiverId,
        { $push: { receivedRequests: requesterId } },
        { session }
      ),
    ]);

    await session.commitTransaction();
    return sendResponse(c, 200, "Takip isteği gönderildi.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu.");
  } finally {
    session.endSession();
  }
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
    const request = await Connection.findOne({
      _id: requestId,
      receiver: userId,
      status: "pending",
    }).session(session);

    if (!request) {
      return sendResponse(c, 400, "Bu isteği kabul edemezsiniz.");
    }

    await Promise.all([
      User.findByIdAndUpdate(
        userId,
        {
          $push: { followers: request.requester },
          $pull: { receivedRequests: request.requester },
        },
        { session }
      ),
      User.findByIdAndUpdate(
        request.requester,
        { $push: { following: userId }, $pull: { sentRequests: userId } },
        { session }
      ),
      Connection.findByIdAndUpdate(
        requestId,
        { status: "accepted" },
        { session }
      ),
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

  const session = await startSession();
  session.startTransaction();

  try {
    const request = await Connection.findOneAndUpdate(
      { _id: requestId, receiver: userId, status: "pending" },
      { status: "rejected" },
      { session }
    );

    if (!request) {
      return sendResponse(c, 400, "İstek bulunamadı veya işlem yapılamaz.");
    }

    await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $pull: { receivedRequests: request.requester } },
        { session }
      ),
      User.findByIdAndUpdate(
        request.requester,
        { $pull: { sentRequests: userId } },
        { session }
      ),
    ]);

    await session.commitTransaction();
    return sendResponse(c, 200, "Takip isteği reddedildi.");
  } catch (error) {
    await session.abortTransaction();
    return sendResponse(c, 500, "Bir hata oluştu.");
  } finally {
    session.endSession();
  }
};

export const getFollowers = async (c: Context) => {
  const { userId } = c.req.param();

  if (!validateObjectId(userId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const user = await User.findById(userId)
    .populate("followers", "username avatar")
    .sort({ createdAt: -1 });
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Takipçiler", user.followers);
};

export const getFollowing = async (c: Context) => {
  const { userId } = c.req.param();

  if (!validateObjectId(userId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  const user = await User.findById(userId)
    .populate("following", "username avatar")
    .sort({ createdAt: -1 });
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Takip edilenler", user.following);
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

export const getConnectionStatuses = async (c: Context) => {
  const userId = c.get("user").id;

  if (!validateObjectId(userId)) {
    return sendResponse(c, 400, "Geçersiz kullanıcı ID.");
  }

  try {
    const sentRequests = await Connection.find({ requester: userId })
      .populate("receiver", "username avatar")
      .lean()
      .sort({ createdAt: -1 });

    const receivedRequests = await Connection.find({ receiver: userId })
      .populate("requester", "username avatar")
      .lean()
      .sort({ createdAt: -1 });

    const acceptedRequests = await Connection.find({
      $or: [
        { requester: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    })
      .populate("requester receiver", "username avatar")
      .lean()
      .sort({ createdAt: -1 });

    const rejectedRequests = await Connection.find({
      $or: [
        { requester: userId, status: "rejected" },
        { receiver: userId, status: "rejected" },
      ],
    })
      .populate("requester receiver", "username avatar")
      .lean()
      .sort({ createdAt: -1 });

    const blockedRequests = await Connection.find({
      $or: [
        { requester: userId, status: "blocked" },
        { receiver: userId, status: "blocked" },
      ],
    })
      .populate("requester receiver", "username avatar")
      .lean()
      .sort({ createdAt: -1 });

    return sendResponse(c, 200, "Bağlantı durumları", {
      sentRequests,
      receivedRequests,
      acceptedRequests,
      rejectedRequests,
      blockedRequests,
    });
  } catch (error) {
    return sendResponse(c, 500, "Bir hata oluştu.");
  }
};
