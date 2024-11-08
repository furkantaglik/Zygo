import { Types } from "mongoose";

export const validateObjectId = (id: string) => Types.ObjectId.isValid(id);
