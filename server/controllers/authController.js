import User from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookies.js';

const register = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new BadRequestError('Email already exists');
  }

  const user = await User.create({ name, lastName, email, password });

  const token = user.createJWT();

  attachCookie({ res, token });

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, lastName: user.lastName, email: user.email } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid Email');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Password');
  }

  const token = user.createJWT();
  user.password = undefined; // Remove password from response

  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { name, lastName, email } = req.body;
  if (!name || !lastName || !email) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.lastName = lastName;
  user.email = email;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'User Logged Out!' });
};

export { register, login, updateUser, getCurrentUser, logout };
