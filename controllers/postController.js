const Post = require("../models/PostModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { default: mongoose } = require("mongoose");
exports.getUserPosts = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const posts = await Post.find({ owner: userId });
  res.status(200).json({ status: "success", data: { posts } });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).json({
    status: "success",
    data: { post },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError("wrong post id", 400));
  res.status(200).json({ status: "success", data: { post } });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  let posts;
  if (!userId) posts = await Post.find();
  else if (mongoose.Types.ObjectId.isValid(userId))
    posts = await Post.find({ owner: userId });
  else return next(new AppError("invalid user id", 404));
  res.status(200).json({ status: "success", data: { posts } });
});

exports.deleteUserPost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) return next(new AppError("the post doesn't exist!", 401));
  if (post.owner.toString() != userId.toString())
    return next(
      new AppError("you are not authorized to delete this post", 403)
    );
  post.delete();
  res.status(204).json({ status: "success" });
});
