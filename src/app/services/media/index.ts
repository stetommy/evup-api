import * as Minio from 'minio';
import * as crypto from 'crypto';

/** Default MinIO bucket name for Video, configurable via environment variable. */
const minioVideoBucketName = process.env.MINIO_VIDEO_BUCKET_NAME || 'default';
/** Default MinIO bucket name for Image, configurable via environment variable. */
const minioImageBucketName = process.env.MINIO_IMAGE_BUCKET_NAME || 'default';
/** Time duration for the presigned URLs to expire (in seconds), configurable via environment variable. */
const linkDie = parseInt(process.env.LINK_DIE || '3600', 10);
/** SSL configuration from  environment variable. */
const minioUseSSL: boolean = process.env.MINIO_USE_SSL?.toLowerCase() === 'true';

/** MinIO client initialization */
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'default',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: minioUseSSL || false,
  accessKey: process.env.MINIO_ACCESS_KEY_ID || 'default',
  secretKey: process.env.MINIO_SECRET_ACCESS_KEY || 'default',
});

/**Generates a presigned URL for a video in MinIO.
 * @param {string} videoName - Name of the video file in MinIO.
 * @returns {Promise<string>} - Resolves to the presigned URL.
 */
export const minioGetVideoUrl = async (videoName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    /** Generate a presigned URL using MinIO client. */
    minioClient.presignedGetObject(minioVideoBucketName, videoName, linkDie, (err: Error, presignedUrl: string) => {
      if (err) {
        /** Reject the Promise if there's an error. */
        reject(`Failed to generate URL: ${err}`);
      } else {
        /** Resolve the Promise with the generated presigned URL. */
        resolve(presignedUrl);
      }
    });
  });
};

/** Uploads a video to MinIO object storage.
 * @param {any} file - The video file to upload.
 * @returns {Promise<{ name: string, bucket: string, length: number }>} - Resolves to metadata of the uploaded video.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const minioUploadVideo = async (file: any): Promise<{ name: string; bucket: string; length: number }> => {
  return new Promise((resolve, reject) => {
    /** Generate a unique key for the video */
    const key = `${crypto.randomUUID()}.${file.mimetype.split('/')[1]}`;
    const buffer = file.buffer;
    const size = file.size;

    /** Video metadata */
    const metaData = {
      'Content-Type': file.mimetype,
    };

    /** Calculate video length */
    const start = buffer.indexOf(Buffer.from('mvhd')) + 16;
    const timeScale = buffer.readUInt32BE(start);
    const duration = buffer.readUInt32BE(start + 4);
    const videoLength = Math.floor(duration / timeScale);

    /** Upload video to object storage */
    minioClient.putObject(minioVideoBucketName, key, buffer, size, metaData, (err: Error | null, data: object) => {
      if (err) {
        /** Reject the Promise if there's an error during the upload */
        reject(`Failed to upload video: ${err}`);
      } else {
        /** Resolve the Promise with metadata of the uploaded video */
        resolve({ ...data, name: key, bucket: minioVideoBucketName, length: videoLength });
      }
    });
  });
};

/** Removes a video from MinIO object storage.
 * @param {string} videoName - Name of the video file in MinIO.
 * @returns {Promise<string>} - Resolves to a success message if the video is removed successfully.
 */
export const minioRemoveVideo = async (videoName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    /** Remove the video from object storage */
    minioClient.removeObject(minioVideoBucketName, videoName, function (err) {
      if (err) {
        /** Reject the Promise if there's an error during removal */
        reject(`Unable to remove object: ${err}`);
      } else {
        /** Resolve the Promise with a success message if removal is successful */
        resolve('Object removed');
      }
    });
  });
};

/** Generates a presigned URL for an image in MinIO.
 * @param {string} imageName - Name of the image file in MinIO.
 * @returns {Promise<string>} - Resolves to the presigned URL for the image.
 */
export const minioGetImageUrl = async (imageName: string | undefined, expiration?: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate a presigned URL using MinIO client
    if (imageName == undefined) resolve('undefined');
    if (!expiration) expiration = linkDie;
    minioClient.presignedGetObject(minioImageBucketName, imageName!, expiration, (err: Error, presignedUrl: string) => {
      if (err) {
        // Reject the Promise if there's an error during URL generation
        reject(`Failed to generate image URL: ${err}`);
      } else {
        // Resolve the Promise with the URL
        resolve(presignedUrl);
      }
    });
  });
};

/** Removes an image from MinIO object storage.
 * @param {string} imageName - Name of the image file in MinIO.
 * @returns {Promise<string>} - Resolves to a success message if the image is removed successfully.
 */
export const minioRemoveImage = async (imageName: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    /** Remove the image from object storage */
    minioClient.removeObject(minioImageBucketName, imageName, function (err) {
      if (err) {
        /** Reject the Promise if there's an error during removal */
        reject(`Unable to remove object: ${err}`);
      } else {
        /** Resolve the Promise with a success message if removal is successful */
        resolve('Object removed');
      }
    });
  });
};

/** Uploads an image to MinIO object storage.
 * @param {any} image - Image data to be uploaded.
 * @returns {Promise<string>} - Resolves to the key of the uploaded image.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const minioUploadImage = async (image: any, expiration?: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    /** Convert image buffer to base64 */
    const convertedImage: string = image.buffer.toString('base64');

    if (!expiration) expiration;

    /** Prepare image for upload */
    const base64Image = Buffer.from(convertedImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    /** Extract image type */
    const type = image.mimetype.split(';')[0].split('/')[1];

    /** Image params */
    const key = `${crypto.randomUUID()}.${type}`;
    const size = base64Image.length;

    /** Image metadata */
    const metaData = {
      'Content-Type': `image/${type}`,
      ContentEncoding: 'base64',
    };

    /** Upload image to object storage */
    minioClient.putObject(
      minioImageBucketName,
      key,
      base64Image,
      size,
      metaData,
      (err: Error | null) => {
        if (err) {
          /** Reject the Promise if there's an error during image upload */
          reject(`Failed to upload image: ${err}`);
        } else {
          /** Resolve the Promise with the key of the uploaded image */
          resolve(key);
        }
      },
    );
  });
};
