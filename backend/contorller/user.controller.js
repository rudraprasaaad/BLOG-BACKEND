import User from "../models/User.js";
import bcrypt from "bcryptjs";

const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }

  if (!users) {
    res.status(404).json({ message: "No users found" });
  }
  res.status(200).json({
    users: users,
  });
};

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    res.status(400).json({ msg: "User already existed!!!" });
  }

  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    blogs: [],
  });
  await user.save();

  res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ msg: "Couldn't find user from this email id" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      msg: "Incorrect password",
    });
  }

  res.status(200).json({ msg: "Loggedin successfully" });
};

export default getAllUser;
