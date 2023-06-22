import { authController } from "./authController";
import { errorController } from "./errorController";
import { AppError } from "../public/js/appError";
import { userController } from "./userController";
import { productController } from "./productController";


export const handleApiRequest = (req, res) => {
    const url = req.url;
    if(url.startsWith('/api')) {
        if(url.startsWith('/api/products')) {
            productController(req, res);
        } else if(url.startsWith('/api/users')) {
            userController(req, res);
        } else if(url.startsWith('/api/auth')) {
            authController(req, res);
        } else {
            errorController(res, new AppError('Not Found', 404));
        }
    }
}