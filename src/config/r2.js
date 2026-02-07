import { S3Client } from '@aws-sdk/client-s3';

// Lazy initialization - client is created on first use
let r2Client = null;

const getR2Client = () => {
  if (!r2Client) {
    // Validate R2 credentials
    const requiredVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(`Missing required R2 environment variables: ${missing.join(', ')}`);
    }

    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return r2Client;
};

// Export a Proxy that creates the client on first property access
export default new Proxy({}, {
  get: (target, prop) => {
    const client = getR2Client();
    return typeof client[prop] === 'function' 
      ? client[prop].bind(client) 
      : client[prop];
  }
});