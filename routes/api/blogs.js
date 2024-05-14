const express = require("express");
const verifyJWT = require("../../middleware/verifyJWT");
const verify_owner = require("../../middleware/verify_owner");
const blogController = require("../../controllers/blogs_controller");

const blogRouter = express.Router();

blogRouter.post("/", verifyJWT, blogController.createBlog);
blogRouter.get("/", blogController.getAllPublishedBlogs);
blogRouter.get("/:id", blogController.getPublishedBlogById);
blogRouter.patch("/:id", verifyJWT, verify_owner, blogController.updateState);
blogRouter.put("/:id", verifyJWT, verify_owner, blogController.editBlogById);
blogRouter.delete(
  "/:id",
  verifyJWT,
  verify_owner,
  blogController.deleteBlogById
);
blogRouter.get(
  "/owner/:id",
  verifyJWT,
  verify_owner,
  blogController.getAllOwnersBlogsById
);

module.exports = blogRouter;
