"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const path_1 = __importDefault(require("path"));
router.get("/getUserLogo", (req, res) => {
    if (req.query == undefined)
        res.send("params not found");
    const { username } = req.query;
    console.log(username);
    res.sendFile(path_1.default.join(__dirname, "../../storage/users/default.png"));
});
exports.default = router;
//# sourceMappingURL=staticRouter.js.map