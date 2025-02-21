const multer = require('multer');

const maxSize = 2 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // accept the file
    } else {
        cb(new Error("Only JPG and PNG files are allowed"), false); // reject file
    }
}

// creating upload middleware
const upload = multer({
    dest: "uploads/",
    limits: {fileSize: maxSize},
    fileFilter: fileFilter
});

module.exports = upload;