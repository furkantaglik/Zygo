import jwt from "jsonwebtoken";
import { sendResponse } from "../lib/utils/sendResponse.js";
import type { Context, Next } from "hono";
import { User } from "../models/user.js";
import { config } from "dotenv";

config();
const JWT_SECRET = process.env.JWT_SECRET_KEY!;

export const checkBearerToken = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(c, 401, "Yetkisiz erişim, Bearer Token bulunamadı");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set("user", decoded);
    await next();
  } catch (error) {
    console.log(error);
    return sendResponse(
      c,
      401,
      "Yetkilendirme Başarısız, Geçersiz Bearer token"
    );
  }
};

export const checkUserRole = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return sendResponse(c, 403, "Kullanıcı bilgileri eksik");
  }

  try {
    const foundUser = await User.findById(user.id);
    if (!foundUser || foundUser.role !== "admin") {
      return sendResponse(c, 403, "Yetkiniz yok");
    }
    await next();
  } catch (error) {
    console.log(error);
    return sendResponse(c, 500, "Rol doğrulaması sırasında bir hata oluştu");
  }
};

// export const checkUserPermission = async (c: Context, next: Next) => {
//   const post = await Post.findById(postId);
//   if (!post) return { error: "Gönderi bulunamadı." };
//   if (post.user.toString() !== userId)
//     return { error: "Bu gönderiye erişim yetkiniz yok." };
//   return { post };
// };
