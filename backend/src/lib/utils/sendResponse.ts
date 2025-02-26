import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const sendResponse = (
  c: Context,
  statusCode: ContentfulStatusCode, 
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
