const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  __filename: (req, file, cb) => {
    cb(null, Date.now().toISOstring() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb({ msg: "not jpg or png" }, false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 8000000 },
  fileFilter: fileFilter
});

module.exports = upload;
