import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

export const sendResponse = (
  c: Context,
  statusCode: StatusCode,
  message: string | null,
  data: any = null
) => {
  return c.json(
    {
      success: statusCode >= 200 && statusCode < 300,
      message,
      data,
    },
    statusCode
  );
};
