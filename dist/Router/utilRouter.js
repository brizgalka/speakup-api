"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UtilController_1 = __importDefault(require("@/App/Controller/UtilController"));
const router = express_1.default.Router();
const utilController = new UtilController_1.default();
router.get("/generatePassword", (req, res) => { res.send(utilController.generatePassword(32)); });
exports.default = router;
//# sourceMappingURL=utilRouter.js.map