import type { Context } from "hono";
import { User } from "../models/user.js";
import { sendResponse } from "../lib/utils/sendResponse.js";
import { Types } from "mongoose";

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
