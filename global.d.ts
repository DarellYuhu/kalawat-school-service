declare type TResponse<T = {}> = {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: T;
};
