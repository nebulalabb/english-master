import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    return {
      folder: 'englishmaster',
      format: (file.mimetype || '').split('/')[1],
      public_id: (file.originalname || '').split('.')[0] + '-' + Date.now(),
    };
  },
});

export const upload = multer({ storage });
export default cloudinary;
