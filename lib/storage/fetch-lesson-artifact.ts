import { GetObjectCommand } from "@aws-sdk/client-s3";

import { createR2Client } from "@/lib/storage/create-r2-client";

function requireBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is not set");
  }
  return bucket;
}

/** Fetches a lesson artifact from R2 by storage key. */
export async function fetchLessonArtifact(key: string) {
  const client = createR2Client();

  const response = await client.send(
    new GetObjectCommand({
      Bucket: requireBucketName(),
      Key: key,
    }),
  );

  if (!response.Body) {
    throw new Error(`Artifact not found: ${key}`);
  }

  return {
    body: response.Body,
    contentType: response.ContentType,
  };
}
