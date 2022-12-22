"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class Server {
    port;
    app;
    router;
    prisma;
    cookieSecret;
    constructor(options) {
        this.port = options.port;
        this.app = options.app;
        this.router = options.router;
        this.prisma = options.prisma;
        this.cookieSecret = options.cookieSecret;
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.urlencoded());
        this.app.use(body_parser_1.default.json());
        this.app.use((0, cookie_parser_1.default)(this.cookieSecret));
        this.app.use(this.router);
        this.app.listen(this.port, () => {
            console.log(`server started on port ${this.port}`);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map