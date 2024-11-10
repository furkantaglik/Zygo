export interface IResponse<T> {
  success: boolean;
  message: string;
  data: T | T[] | null;
}
