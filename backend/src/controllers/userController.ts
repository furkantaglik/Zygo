import type { Context } from "hono";
import { User, type IUser } from "../models/user.js";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Types } from "mongoose";

export const updateUser = async (c: Context) => {
  const file = await c.get("file");
  const { user } = await c.req.parseBody();

  let parsedUser;

  if (typeof user === "string") {
    parsedUser = JSON.parse(user);
  }

  if (!user) {
    return sendResponse(c, 400, "k.");
  }

  if (parsedUser.username) {
    const existingUser = await User.findOne({ username: parsedUser.username });
    if (existingUser && existingUser._id!.toString() !== parsedUser.id) {
      return sendResponse(c, 400, "Bu kullanıcı adı zaten alınmış.");
    }
  }

  if (file?.path) {
    parsedUser.avatar = file.path;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(parsedUser.id, {
      ...parsedUser,
    });
    if (!updatedUser) {
      return sendResponse(c, 404, "Kullanıcı bulunamadı.");
    }
    return sendResponse(
      c,
      200,
      "Kullanıcı başarıyla güncellendi.",
      updatedUser
    );
  } catch (error) {
    return sendResponse(c, 500, "Kullanıcı güncellenirken bir hata oluştu.");
  }
};

export const getAllUsers = async (c: Context) => {
  const users = await User.find();
  return sendResponse(c, 200, "Kullanıcılar başarıyla getirildi.", users);
};

export const getByUserId = async (c: Context) => {
  const { userId } = c.req.param();

  if (!userId || !Types.ObjectId.isValid(userId)) {
    return sendResponse(c, 400, "Geçersiz veya eksik kullanıcı ID.");
  }

  const user = await User.findById(userId);
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Kullanıcı başarıyla bulundu.", user);
};

export const getByUsername = async (c: Context) => {
  const { username } = c.req.param();

  if (!username) {
    return sendResponse(c, 400, "Kullanıcı adı eksik.");
  }

  const user = await User.findOne({ username });
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Kullanıcı başarıyla bulundu.", user);
};

export const getByEmail = async (c: Context) => {
  const { email } = c.req.param();

  if (!email) {
    return sendResponse(c, 400, "E-posta adresi eksik.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(c, 404, "Kullanıcı bulunamadı.");
  }

  return sendResponse(c, 200, "Kullanıcı başarıyla bulundu.", user);
};
