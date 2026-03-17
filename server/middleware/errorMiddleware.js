"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorMiddleware = function (err, req, res, next) {
    console.log(err);
    if (res.headersSent) {
        return next();
    }
    var status = err.status || 500;
    var message = err.message || "Server  error";
    res.status(status).json({ message: message });
    return next();
};
exports.default = errorMiddleware;
