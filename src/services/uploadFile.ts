import multer from 'multer';
import util from 'util';
import path from 'path';
const maxSize = 40 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.dirname('./') + '/src/files/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single('file');

export default util.promisify(uploadFile);
