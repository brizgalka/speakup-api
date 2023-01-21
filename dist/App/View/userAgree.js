"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const file_path = path_1.default.join(__dirname, "/userAgree.txt");
class userAgree {
    getUserAgree() {
        try {
            const data = fs_1.default.readFileSync(file_path, 'utf8');
            return data;
        }
        catch (err) {
            console.error(err);
        }
    }
    editUserAgree(newText) {
        try {
            fs_1.default.writeFileSync(file_path, newText, 'utf8');
        }
        catch (err) {
            console.error(err);
        }
    }
}
//# sourceMappingURL=userAgree.js.map