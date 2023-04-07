import { PRIVATE_S3_KEY } from '$env/static/private'
import { PUBLIC_S3_KEY, PUBLIC_S3_URL, PUBLIC_S3_REGION, PUBLIC_S3_BUCKET_NAME } from '$env/static/public'


// Step 1: Import the S3Client object and all necessary SDK commands.
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';


// Step 2: The s3Client function validates your request and directs it to your Space's specified endpoint using the AWS SDK.
const s3Client = new S3Client({
    endpoint: PUBLIC_S3_URL, // Find your endpoint in the control panel, under Settings. Prepend "https://".
    forcePathStyle: false, // Configures to use subdomain/virtual calling format.
    region: PUBLIC_S3_REGION, // Must be "us-east-1" when creating new Spaces. Otherwise, use the region in your endpoint (e.g. nyc3).
    credentials: {
      accessKeyId: PUBLIC_S3_KEY, // Access key pair. You can create access key pairs using the control panel or API.
      secretAccessKey: PRIVATE_S3_KEY // Secret access key defined through an environment variable.
    }
});


export const actions = {
    upload: async (request) => {
        // Step 3: Define the parameters for the object you want to upload.
        const params = {
          Bucket: PUBLIC_S3_BUCKET_NAME, // The path to the directory you want to upload the object to, starting with your Space name.
          Key: "folder-path/hello-world.txt", // Object key, referenced whenever you want to access this file later.
          Body: 'HELLO', // The object's contents. This variable is an object, not a string.
          ACL: "private", // Defines ACL permissions, such as private or public.
        //   Metadata: { // Defines metadata tags.
        //     "x-amz-meta-my-key": "your-value"
        //   }
        };

        // Step 4: Define a function that uploads your object using SDK's PutObjectCommand object and catches any errors.
        const uploadObject = async () => {
            try {
            const data = await s3Client.send(new PutObjectCommand(params));
            console.log(
                "Successfully uploaded object: " +
                params.Bucket +
                "/" +
                params.Key
            );
            return data;
            } catch (err) {
            console.log("Error", err);
            }
        };

        uploadObject();

    }
  }






