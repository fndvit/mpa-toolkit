export const error = (status: number, msg: string) => ({
  status,
  body: { error: msg }
});

export const error400 = (msg: string) => error(400, msg);
export const error404 = (msg: string) => error(404, msg);