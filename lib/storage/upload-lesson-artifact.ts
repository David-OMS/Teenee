import { PutObjectCommand } from "@aws-sdk/client-s3";

import { createR2Client } from "@/lib/storage/create-r2-client";

export type UploadLessonArtifactInput = {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
};

function requireBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is not set");
  }
  return bucket;
}

/** Uploads a raw lesson dump artifact (audio, PDF, image) to R2. */
export async function uploadLessonArtifact(input: UploadLessonArtifactInput) {
  const client = createR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: requireBucketName(),
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
    }),
  );

  return { key: input.key };
}
