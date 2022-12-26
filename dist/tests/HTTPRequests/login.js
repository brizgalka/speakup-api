"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
http_1.default.request({
    host: 'http://localhost:6060',
    path: '/api/auth/register',
}, res => console.log(res)).end();
//# sourceMappingURL=login.js.map