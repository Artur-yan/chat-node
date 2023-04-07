import { PRIVATE_S3_KEY } from '$env/static/private'
import { PUBLIC_S3_KEY, PUBLIC_S3_URL, PUBLIC_S3_REGION, PUBLIC_S3_BUCKET_NAME } from '$env/static/public'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { json } from '@sveltejs/kit';

const s3Client = new S3Client({
    endpoint: PUBLIC_S3_URL,
    forcePathStyle: false,
    region: PUBLIC_S3_REGION,
    credentials: {
      accessKeyId: PUBLIC_S3_KEY,
      secretAccessKey: PRIVATE_S3_KEY
    }
});

export const POST = async ({ request }) => {
	const params = {
		Bucket: PUBLIC_S3_BUCKET_NAME,
		Key: "folder-path/hello-world.txt",
		Body: 'HELLO',
		ACL: "private",
	};

	const { a, b } = await request.json();
	return json(a + b);
};
