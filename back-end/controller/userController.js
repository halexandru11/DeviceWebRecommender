import { catchAsync } from '../public/js/catchAsync.js';
import { errorController } from './errorController.js';
import { AppError } from '../public/js/appError.js';
import { protect, restrictTo } from './authController.js';
import { parseRequestBody } from '../public/js/parseRequest.js';

import { getAllUsers, deleteUserById } from '../model/users.js';

const getAllUsers = catchAsync(async (req, res) => {
    const result = await getAllUsers();
    res.statusCode = 200;
    res.end(JSON.stringify({result}));
});

const deleteUserById = catchAsync(async (req, res) => {
    const id = req.url.split('/')[3];
    const result = await deleteUserById(id);
    if(result) {
        res.statusCode = 204;
        res.end();
    }
    else {
        errorController(res, new AppError('User not found', 404));
    }
});

const deleteSelf = catchAsync(async (req, res) => {
    const id = req.user.id;
    const result = await deleteUserById(id);
    if(result) {
        res.statusCode = 204;
        res.end();
    }
    else {
        errorController(res, new AppError('User not found', 404));
    }
});

const getSelf = catchAsync(async (req, res) => {
    res.statusCode = 200;
    res.end(JSON.stringify({
        status: 'success',
        user: req.currentUser
    }));
});

export const userController = catchAsync(async (req, res) => {
    const {url, method} = req;
    res.setHeader('Content-Type', 'application/json');
    if(url === 'api/users' && method === 'GET') {
        const logUser = await protect(req, res);
        if(!logUser) return;
        if(!restrictTo(res, logUser, 'admin')) return;
        getAllUsers(req, res);
    }
    else if(url.match(/\/api\/users\/([0-9]+)/) && method === 'DELETE') {
        const logUser = await protect(req, res);
        if(!logUser) return;
        if(!restrictTo(res, logUser, 'admin')) return;
        deleteUserById(req, res);
    }
    else if(url === 'api/users/self' && method === 'GET') {
        const logUser = await protect(req, res);
        if(!logUser) return;
        getSelf(req, res);
    }
    else if(url === 'api/users/self' && method === 'DELETE') {
        const logUser = await protect(req, res);
        if(!logUser) return;
        deleteSelf(req, res);
    }
    else {
        errorController(res, new AppError('Not Found', 404));
    }
});