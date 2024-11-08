import { sendResponse } from "../lib/utils/sendResponse.js";
import type { Context } from "hono";
import { User } from "../models/user.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

config();

const JWT_SECRET = process.env.JWT_SECRET_KEY!;
const PASS_SALT = process.env.PASS_SALT_ROUNDS!;

if (!JWT_SECRET || !PASS_SALT) {
  throw new Error(
    "JWT_SECRET_KEY veya PASS_SALT_ROUNDS çevresel değişkeni eksik"
  );
}

export const generateEncryptedPassword = async (password: string) => {
  const saltRounds = parseInt(PASS_SALT, 10);
  return bcrypt.hash(password, saltRounds);
};

export const generateDecryptedPassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateJwt = (user: object): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyUser = async (
  username: string,
  email: string
): Promise<boolean> => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  return !!existingUser;
};

export const register = async (c: Context) => {
  const { email, username, password, firstName, lastName } = await c.req.json();

  if (!email || !username || !password || !firstName || !lastName) {
    return sendResponse(c, 400, "Tüm alanları doldurduğunuzdan emin olun.");
  }

  const userExists = await verifyUser(username, email);
  if (userExists) {
    return sendResponse(c, 400, "Kullanıcı zaten mevcut");
  }

  try {
    const hashedPassword = await generateEncryptedPassword(password);
    const addedUser = new User({
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword,
    });
    await addedUser.save();

    const token = generateJwt({
      id: addedUser._id,
      email: addedUser.email,
      username: addedUser.username,
    });

    return sendResponse(c, 200, "Kayıt başarılı", token);
  } catch (error) {
    return sendResponse(c, 500, "Kayıt sırasında bir hata oluştu.");
  }
};

export const login = async (c: Context) => {
  const { emailOrUsername, password } = await c.req.json();

  if (!emailOrUsername || !password) {
    return sendResponse(c, 400, "Kullanıcı adı veya şifre boş olamaz.");
  }

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return sendResponse(c, 404, "Kullanıcı bulunamadı");
    }

    const isPasswordValid = await generateDecryptedPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return sendResponse(c, 401, "Şifre Geçersiz");
    }

    const token = generateJwt({
      id: user._id,
      email: user.email,
      username: user.username,
    });

    return sendResponse(c, 200, "Giriş başarılı", token);
  } catch (error) {
    return sendResponse(c, 500, "Giriş sırasında bir hata oluştu.");
  }
};
