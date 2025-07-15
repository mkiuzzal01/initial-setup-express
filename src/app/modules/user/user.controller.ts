import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.updateUserIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.deleteUSerFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await userService.getSingleUserFromDB(slug);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users fetched successfully',
    data: result,
  });
});

export const userController = {
  createUser,
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUsers,
};
