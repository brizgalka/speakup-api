"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("@/Router/userRouter"));
const authRouter_1 = __importDefault(require("@/Router/authRouter"));
const infoRouter_1 = __importDefault(require("@/Router/infoRouter"));
const router = (0, express_1.default)();
//router.use(verifyUser);
router.use('/user', userRouter_1.default);
router.use('/auth', authRouter_1.default);
router.get('/', (req, res) => {
    res.send("hgelloe");
});
router.use('/info', infoRouter_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map