const router = require("express").Router();
const { protect } = require("../controllers/authController");
const {
  createPost,
  getPost,
  getUserPosts,
  getAllPosts,
  deleteUserPost,
} = require("../controllers/postController");

router
  .route("/")
  .post(
    protect,
    // add your id to post details
    (req, res, next) => {
      req.body.owner = req.user._id;
      next();
    },
    createPost
  )
  .get(getAllPosts);
router.get(
  "/me",
  protect,
  // make your self as a post owner
  (req, res, next) => {
    req.params.userId = req.user._id;
    next();
  },
  getUserPosts
);

router.route("/:postId").get(getPost).delete(protect, deleteUserPost);

module.exports = router;
