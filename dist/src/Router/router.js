"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("@/Router/userRouter"));
const authRouter_1 = __importDefault(require("@/Router/authRouter"));
const path_1 = __importDefault(require("path"));
const AuthMiddleware_1 = __importDefault(require("@/App/middleware/AuthMiddleware"));
const infoRouter_1 = __importDefault(require("@/Router/infoRouter"));
const utilRouter_1 = __importDefault(require("@/Router/utilRouter"));
const staticRouter_1 = __importDefault(require("@/Router/staticRouter"));
const router = (0, express_1.default)();
const apiInfoPath = path_1.default.join(__dirname, "/api.info");
router.get("/", (req, res) => {
    res.sendFile(apiInfoPath);
});
//router.use(verifyUser);
router.use((error, req, res, next) => {
    console.log(error);
    if (error) {
        res.status(500);
        res.send("Server error");
    }
    else {
        next();
    }
});
router.use('/user', AuthMiddleware_1.default, userRouter_1.default);
router.use('/auth', authRouter_1.default);
router.use('/info', infoRouter_1.default);
router.use('/util', utilRouter_1.default);
router.use('/static', staticRouter_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map