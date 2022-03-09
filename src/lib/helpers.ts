
export const staticUrl = (path: string) =>
  `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.amazonaws.com/${path}`;

