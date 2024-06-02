import Blog from "../models/Blog.js";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    console.log(err);
  }

  if (!blogs) {
    return res.status(404).json({ msg: "Blogs not found" });
  }

  res.status(200).json({ blogs: blogs });
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res.status(400).json({ msg: "Unable to find user by this id" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await Blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }

  if (!blog) {
    return res.status(404).json({ msg: "Unable to create blogs" });
  }

  res.status(200).json({ msg: "Blog created Successfully" });
};

export const updateBlog = async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;

  let blog;
  try {
    blog = await Blog.findByIdAndUpdate(id, { title, description });
  } catch (err) {
    console.log(err);
  }

  if (!blog) {
    return res.status(500).json({ msg: "Unable to update the blog" });
  }

  res.status(200).json({ msg: "Updated Blog successfully" });
};

export const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    console.log(err);
  }

  if (!blog) {
    return res.status(404).json({ msg: "No blogs found at particular id" });
  }

  return res.status(200).json({ blog: blog });
};

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    console.log(err);
  }

  if (!blog) {
    return res.status(404).json({ msg: "No blogs found at particular id" });
  }

  return res.status(200).json({ msg: "Blog deleted Successfully" });
};

export const getByUserId = async (req, res) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(user).populate("blog");
  } catch (err) {
    console.log(err);
  }

  if (!userBlogs) {
    return res.status(404).json({ msg: "No blogs found" });
  }

  return res.status(200).json({ blogs: userBlogs });
};
