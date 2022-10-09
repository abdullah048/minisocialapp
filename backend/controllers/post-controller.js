const Post = require("../models/post");
const path = require("path");

exports.getAllPosts = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  const posts = await postQuery;
  const totalPosts = await Post.countDocuments();

  res.status(200).json({ posts, totalPosts });
};

exports.createPost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = req.body;
  req.body.imagePath = url + "/uploads/" + req.file.filename;
  const newPost = await Post.create(post);
  if (newPost) {
    res.status(201).json({
      message: "Post Created!",
      newPost: {
        title: newPost.title,
        content: newPost.content,
        id: newPost._id,
        imagePath: newPost.imagePath,
      },
    });
  }
};

exports.deletePost = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post has been deleted successfully!" });
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.updatePost = async (req, res, next) => {
  const id = req.params.id;
  const post = req.body;
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/uploads/" + req.file.filename;
    post.imagePath = imagePath;
  }
  try {
    await Post.findByIdAndUpdate(id, post);
    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.log("Error:", error);
  }
};

exports.getPost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};
