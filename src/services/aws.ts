import { S3Client } from '@aws-sdk/client-s3'

import multer from 'multer'
import multerS3 from 'multer-s3'
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME!,
    key: function (req, file, cb) {
      const fileName = `cars/${Date.now().toString()}-${file.originalname}`
      cb(null, fileName)
    },
  }),
})

// export const getPresignedUrl = async (fileName: string, fileType: string): Promise<string> => {
//   const command = new PutObjectCommand({
//     Bucket: process.env.AWS_S3_BUCKET_NAME!,
//     Key: `cars/${fileName}`, // unique file name
//     ContentType: fileType,
//   })

//   // Generate a presigned URL valid for 15 minutes
//   const url = await getSignedUrl(s3Client, command, { expiresIn: 900 })
//   return url
// }

export { upload }
