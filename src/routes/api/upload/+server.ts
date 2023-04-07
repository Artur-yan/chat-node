import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { PUBLIC_S3_URL, PUBLIC_S3_REGION, PUBLIC_S3_KEY } from "$env/static/public";
import { PRIVATE_S3_KEY } from "$env/static/private";

const s3 = new S3Client({
    endpoint: PUBLIC_S3_URL,
    forcePathStyle: false,
    region: PUBLIC_S3_REGION,
    credentials: {
      accessKeyId: PUBLIC_S3_KEY,
      secretAccessKey: PRIVATE_S3_KEY
    }
});

export const POST = async ({ request }) => {

    const { fileName } = await request.json();

    // const command = new PutObjectCommand(putObjectParams);
    // const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

};