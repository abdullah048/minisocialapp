const express = require("express");
const multer = require("multer");
const path = require("path");

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Invalid Mime-Type");
    if (isValid) {
      error = null;
    }
    cb(error, "./uploads/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

const {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  getPost,
} = require("../controllers/post-controller");

const router = express.Router();

router.route("/posts").get(getAllPosts);
router
  .route("/post/new")
  .post(multer({ storage: storage }).single("image"), createPost);
router.route("/post/:id").delete(deletePost);
router
  .route("/post/:id")
  .put(multer({ storage: storage }).single("image"), updatePost);
router.route("/post/:id").get(getPost);

module.exports = router;
