// src/lib/upload.ts - S3 파일 업로드
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFile = async (
  file: File,
  folder: string
): Promise<string> => {
  try {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const buffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileName,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      ContentDisposition: "inline",
    });

    await s3Client.send(command);

    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("파일 업로드에 실패했습니다");
  }
};
