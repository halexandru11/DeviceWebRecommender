class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 400, 404, 401, 403, 422, 500

        Error.captureStackTrace(this, this.constructor);
    }
}