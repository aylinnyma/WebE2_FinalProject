const multer = require('multer'); // import multer
const path = require('path');

const storage = multer.diskStorage({
    // we save files in disk
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        // add date to avoid duplicates
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
      }
    });

    const fileFilter = (req, file, cb) => {
        // reject non-image file-types
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      };

      const upload = multer({
        // final upload, combines everything
        storage,
        fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }
      });

      // export for route files
      module.exports = upload;