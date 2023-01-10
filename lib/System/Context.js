"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApplicationContext = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var ApplicationContext = /*#__PURE__*/_createClass(function ApplicationContext(options) {
  _classCallCheck(this, ApplicationContext);
  ApplicationContext.redis = options.redis;
  ApplicationContext.wss = options.wss;
  ApplicationContext.server = options.server;
  ApplicationContext.prisma = options.prisma;
  ApplicationContext.tgBot = options.tgBot;
  ApplicationContext.servername = options.config.servername;
  ApplicationContext.mode = options.config.mode;
  console.log("\n            Server context: \n            REDIS: ".concat(ApplicationContext.redis != undefined, " \n            EXPRESS: ").concat(ApplicationContext.server != undefined, " \n            WSS: ").concat(ApplicationContext.wss != undefined, "\n            PRISMA ").concat(ApplicationContext.prisma != undefined, "\n            TGBOT ").concat(ApplicationContext.tgBot != undefined, "\n        "));
});
exports.ApplicationContext = ApplicationContext;