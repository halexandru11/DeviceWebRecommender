import jwt from 'jsonwebtoken';
import { parseRequestBody } from '../public/js/parseRequest';
 
const signToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const signup = catchAsync(async (req, res) => {
    const user = await parseRequestBody(req);

    if(!user) {
        errorController(res, new AppError('Please provide user data', 400));
        return;
    }
    if(user.role){
        errorController(res, new AppError('You cannot set your own role', 400));
        return;
    }
    if(!user.username || !user.password || !user.email || !user.first_name || !user.last_name || !user.theme || !user.phone) {
        errorController(res, new AppError('Please provide all required fields', 400));
        return;
    }
    if(await users.validateUsername(user.username)) {
        errorController(res, new AppError('Username already exists', 400));
        return;
    }
    if(await users.validateEmail(user.email)) {
        errorController(res, new AppError('Email already exists', 400));
        return;
    }

    user.role = 'user';
    const result = await users.createUser(user);

    const token = signToken(result.id, result.username);

    const response = {
        status: 'success',
        token,
        data: {
            user: result
        }
    }

    res.statusCode = 201;
    res.end(JSON.stringify(response));
});

const login = catchAsync(async (req, res) => {
    const {username, password} = await parseRequestBody(req);

    if(!username || !password) {
        errorController(res, new AppError('Please provide username and password', 400));
        return;
    }

    const user = await users.getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        errorController(res, new AppError('Incorrect username or password', 401));
        return;
    }

    const token = signToken(user.id, user.username);
    const response = {
        status: 'success',
        token,
    };
    res.statusCode = 200;
    res.end(JSON.stringify(response));
});

const forgotPassword = catchAsync(async (req, res) => {
   const {email} = await parseRequestBody(req);
   if(!email) {
       errorController(res, new AppError('Please provide email', 400));
       return;
   }
   if(!await users.validateEmail(email)) {
       errorController(res, new AppError('Email does not exist', 400));
       return;
   }
   res.statusCode = 200;
   res.end(JSON.stringify({
       status: 'success',
       message: 'Email exists'
   }));
});

const resetPassword = catchAsync(async (req, res) => {
    const {email, password, passwordConfirm} = await parseRequestBody(req);
    if(!email || !password || !passwordConfirm) {
        errorController(res, new AppError('Please provide email, password and passwordConfirm', 400));
        return;
    }
    if(password !== passwordConfirm) {
        errorController(res, new AppError('Passwords do not match', 400));
        return;
    }
    const result = await users.updatePassword(email, password);
    if(!result) {
        errorController(res, new AppError('Error updating user', 400));
        return;
    }
    const response = {
        status: 'success',
        message: 'Password updated'
    }
    res.statusCode = 204;
    res.end(JSON.stringify(response));
});

export const protect = catchAsync(async(req, res) =>{
    // verify the existence of the token
     let token;
     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         token = req.headers.authorization.split(' ')[1];
     }
     if(!token) {
         errorController(res, new AppError('You are not logged in! Please log in to get access.', 401));
         return null;
     }
 
     // verify the token
     const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
 
     // check if the user still exists
     const freshUser = await users.getUserByUsername(decoded.username);
     if(!freshUser) {
         errorController(res, new AppError('The user belonging to this token does no longer exist.', 401));
         return null;
     }
 
     req.currentUser = freshUser;
     return freshUser;
 });

 export const restrictTo = (res, user, ...roles) => {
    if(!roles.includes(user.role)) {
        errorController(res, new AppError('You do not have permission to perform this action', 403));
        return false;
    }
    return true;
}

export const authController = catchAsync(async (req, res) => {
    const { method, url } = req;
    res.setHeader('Content-Type', 'application/json');
    if(url === '/api/auth/signup' && method === 'POST') {
        signup(req, res);
    } else if(url === '/api/auth/login' && method === 'POST') {
        login(req, res);
    } else if(url === '/api/auth/forgotPassword' && method === 'POST') {
        forgotPassword(req, res);
    } else if(url === '/api/auth/resetPassword' && method === 'POST') {
        resetPassword(req, res);
    } else {
        errorController(res, new AppError('Not Found', 404));
    }
});














// import querystring from 'querystring';
// import { sendConfirmationEmail } from './emailService.js';


// if (req.method === "POST" && req.url === "/auth/signup.html") {
//   let body = [];
//   req
//     .on("data", (chunk) => {
//       body.push(chunk);
//     })
//     .on("end", () => {
//       body = Buffer.concat(body).toString();
//       let values = querystring.parse(body);
//       console.log(values);
//       console.log(body);
//       const email = values.email;
//       const username = values.username;
//       //rewrite this part
//       res.writeHead(302, { Location: "../pages/products/products.html" });
//       sendConfirmationEmail(email, username);
//       res.end();
//     });
// }
