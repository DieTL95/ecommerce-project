"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ForbiddenError = exports.UnauthorisedError = exports.BadRequestError = exports.ErrorBase = void 0;
var ErrorBase = /** @class */ (function (_super) {
    __extends(ErrorBase, _super);
    function ErrorBase(message, status) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        return _this;
    }
    return ErrorBase;
}(Error));
exports.ErrorBase = ErrorBase;
var BadRequestError = /** @class */ (function (_super) {
    __extends(BadRequestError, _super);
    function BadRequestError(message) {
        return _super.call(this, message, 400) || this;
    }
    return BadRequestError;
}(ErrorBase));
exports.BadRequestError = BadRequestError;
var UnauthorisedError = /** @class */ (function (_super) {
    __extends(UnauthorisedError, _super);
    function UnauthorisedError(message) {
        return _super.call(this, message, 401) || this;
    }
    return UnauthorisedError;
}(ErrorBase));
exports.UnauthorisedError = UnauthorisedError;
var ForbiddenError = /** @class */ (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(message) {
        return _super.call(this, message, 403) || this;
    }
    return ForbiddenError;
}(ErrorBase));
exports.ForbiddenError = ForbiddenError;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message) {
        return _super.call(this, message, 404) || this;
    }
    return NotFoundError;
}(ErrorBase));
exports.NotFoundError = NotFoundError;
