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
const userApiRouter_1 = __importDefault(require("@/Router/userApiRouter"));
const VerifyUser_1 = __importDefault(require("@/App/middleware/VerifyUser"));
const UserMetrika_1 = __importDefault(require("@/System/Metrika/UserMetrika"));
const RoleMiddleware_1 = __importDefault(require("@/App/middleware/RoleMiddleware"));
const adminRouter_1 = __importDefault(require("@/Router/adminRouter"));
const router = (0, express_1.default)();
const apiInfoPath = path_1.default.join(__dirname, "/api.info");
router.get("/", (req, res) => {
    res.sendFile(apiInfoPath);
});
router.use(async (req, res, next) => {
    // @ts-ignore
    await (0, UserMetrika_1.default)(req, next);
});
router.use((error, req, res, next) => {
    if (error) {
        res.status(500);
        res.send("Server error");
    }
    else {
        next();
    }
});
router.use('/user', [AuthMiddleware_1.default, VerifyUser_1.default], userRouter_1.default);
router.use('/auth', VerifyUser_1.default, authRouter_1.default);
router.use('/info', VerifyUser_1.default, infoRouter_1.default);
router.use('/util', VerifyUser_1.default, utilRouter_1.default);
router.use('/userApi', VerifyUser_1.default, userApiRouter_1.default);
router.use('/static', staticRouter_1.default);
router.use('/admin', [AuthMiddleware_1.default, VerifyUser_1.default, (0, RoleMiddleware_1.default)("ADMIN")], adminRouter_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map