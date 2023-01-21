"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const libxmljs2_1 = __importDefault(require("libxmljs2"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const file = path_1.default.join(__dirname, "/userViews.xml");
const xmlString = fs_1.default.readFileSync(file, "utf-8").toString();
const xmlDoc = libxmljs2_1.default.parseXmlString(xmlString);
const gchild = xmlDoc.get('//HelloText');
class TelegramView {
    static sendHelloText(tgId) {
        console.log(xmlString);
        console.log(xmlDoc);
    }
}
exports.default = TelegramView;
//# sourceMappingURL=telegramView.js.map