"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiError = _interopRequireDefault(require("@/App/error/ApiError"));
var _AuthController = _interopRequireDefault(require("./AuthController"));
var _client = require("@prisma/client");
var _CRYPTO_Manager = require("@/Utils/CRYPTO_Manager");
var _Context = require("@/System/Context");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var prisma = new _client.PrismaClient();
var authController = new _AuthController["default"]();
var ChatController = /*#__PURE__*/function () {
  function ChatController() {
    _classCallCheck(this, ChatController);
  }
  _createClass(ChatController, [{
    key: "createChat",
    value: function () {
      var _createChat = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res, next) {
        var username, token, user, new_user, chat_condidate, chat;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              if (!(req.body == undefined)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "Invalid body"));
            case 3:
              username = req.body.username;
              token = req.cookies['token'];
              _context.next = 7;
              return authController.getUser(token);
            case 7:
              user = _context.sent;
              _context.next = 10;
              return prisma.user.findFirst({
                where: {
                  username: username
                }
              });
            case 10:
              new_user = _context.sent;
              _context.next = 13;
              return prisma.dialog.findFirst({
                where: {
                  user1Id: new_user.id,
                  user2Id: user.id
                }
              });
            case 13:
              _context.t0 = _context.sent;
              if (_context.t0) {
                _context.next = 18;
                break;
              }
              _context.next = 17;
              return prisma.dialog.findFirst({
                where: {
                  user2Id: new_user.id,
                  user1Id: user.id
                }
              });
            case 17:
              _context.t0 = _context.sent;
            case 18:
              chat_condidate = _context.t0;
              if (!chat_condidate) {
                _context.next = 21;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "Chat already exist"));
            case 21:
              if (user) {
                _context.next = 23;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 500, "Server error"));
            case 23:
              if (new_user) {
                _context.next = 25;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "User not found"));
            case 25:
              _context.next = 27;
              return prisma.dialog.create({
                data: {
                  createdAt: new Date(),
                  secret: (0, _CRYPTO_Manager.genSecret)(16),
                  user1: {
                    connect: {
                      id: user.id
                    }
                  },
                  user2: {
                    connect: {
                      id: new_user.id
                    }
                  },
                  user1Name: user.username,
                  user2Name: new_user.username,
                  DialogName: user.username + " and " + new_user.username
                }
              });
            case 27:
              chat = _context.sent;
              res.sendStatus(200);
              _context.next = 35;
              break;
            case 31:
              _context.prev = 31;
              _context.t1 = _context["catch"](0);
              console.warn(_context.t1.toString());
              res.sendStatus(500);
            case 35:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 31]]);
      }));
      function createChat(_x, _x2, _x3) {
        return _createChat.apply(this, arguments);
      }
      return createChat;
    }()
  }, {
    key: "getDialogInfo",
    value: function () {
      var _getDialogInfo = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
        var chatId, token, user, dialog;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              if (!(req.body == undefined)) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return", new _ApiError["default"](res, 400, "Invalid body"));
            case 3:
              chatId = req.body.chatId;
              token = req.cookies['token'];
              if (chatId) {
                _context2.next = 7;
                break;
              }
              return _context2.abrupt("return", new _ApiError["default"](res, 400, "Invalid chatId"));
            case 7:
              _context2.next = 9;
              return authController.getUser(token);
            case 9:
              user = _context2.sent;
              _context2.next = 12;
              return ChatController.getDialog(chatId, user);
            case 12:
              dialog = _context2.sent;
              if (dialog) {
                res.json(dialog);
              } else {
                res.send(404);
              }
              _context2.next = 20;
              break;
            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](0);
              res.sendStatus(500);
              console.warn(_context2.t0.toString());
            case 20:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 16]]);
      }));
      function getDialogInfo(_x4, _x5, _x6) {
        return _getDialogInfo.apply(this, arguments);
      }
      return getDialogInfo;
    }()
  }, {
    key: "sendMessage",
    value: function () {
      var _sendMessage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res, next) {
        var _req$body, message, chatId, token, user, dialog, secretMessage, resultMessage, reciever, _iterator, _step, connection, ws_connection, ws_user;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              if (!(req.body == undefined)) {
                _context3.next = 3;
                break;
              }
              return _context3.abrupt("return", new _ApiError["default"](res, 400, "Invalid body"));
            case 3:
              _req$body = req.body, message = _req$body.message, chatId = _req$body.chatId;
              token = req.cookies['token'];
              if (message) {
                _context3.next = 7;
                break;
              }
              return _context3.abrupt("return", new _ApiError["default"](res, 400, "Invalid message"));
            case 7:
              if (chatId) {
                _context3.next = 9;
                break;
              }
              return _context3.abrupt("return", new _ApiError["default"](res, 400, "Invalid chatId"));
            case 9:
              if (!(message.length > 850)) {
                _context3.next = 11;
                break;
              }
              return _context3.abrupt("return", new _ApiError["default"](res, 400, "Message to long"));
            case 11:
              _context3.next = 13;
              return authController.getUser(token);
            case 13:
              user = _context3.sent;
              _context3.next = 16;
              return ChatController.getDialog(chatId, user);
            case 16:
              dialog = _context3.sent;
              secretMessage = (0, _CRYPTO_Manager.encrypt)(message, dialog.secret);
              resultMessage = JSON.stringify(secretMessage);
              if (!dialog) {
                _context3.next = 46;
                break;
              }
              _context3.next = 22;
              return prisma.message.create({
                data: {
                  createdAt: new Date(),
                  message: resultMessage,
                  senderId: user.id,
                  dialogId: dialog.id
                }
              });
            case 22:
              reciever = "";
              if (dialog.user1 == user) {
                reciever = dialog.user2Name;
              } else {
                reciever = dialog.user1Name;
              }
              _iterator = _createForOfIteratorHelper(_Context.ApplicationContext.wss.connections.entries());
              _context3.prev = 25;
              _iterator.s();
            case 27:
              if ((_step = _iterator.n()).done) {
                _context3.next = 35;
                break;
              }
              connection = _step.value;
              ws_connection = connection[0];
              ws_user = connection[1];
              if (ws_user.user.username == reciever) {
                _Context.ApplicationContext.wss.sendMessage(ws_user.uuid, {
                  "message": "new message",
                  "data": {
                    chatId: chatId,
                    message: message
                  }
                });
              }
              return _context3.abrupt("return", 1);
            case 33:
              _context3.next = 27;
              break;
            case 35:
              _context3.next = 40;
              break;
            case 37:
              _context3.prev = 37;
              _context3.t0 = _context3["catch"](25);
              _iterator.e(_context3.t0);
            case 40:
              _context3.prev = 40;
              _iterator.f();
              return _context3.finish(40);
            case 43:
              res.send(200);
              _context3.next = 47;
              break;
            case 46:
              res.send("Chat not found");
            case 47:
              _context3.next = 53;
              break;
            case 49:
              _context3.prev = 49;
              _context3.t1 = _context3["catch"](0);
              console.warn(_context3.t1.toString());
              res.sendStatus(500);
            case 53:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[0, 49], [25, 37, 40, 43]]);
      }));
      function sendMessage(_x7, _x8, _x9) {
        return _sendMessage.apply(this, arguments);
      }
      return sendMessage;
    }()
  }, {
    key: "deleteMessage",
    value: function () {
      var _deleteMessage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function deleteMessage() {
        return _deleteMessage.apply(this, arguments);
      }
      return deleteMessage;
    }()
  }, {
    key: "getMessages",
    value: function () {
      var _getMessages = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res, next) {
        var chatId, token, user, dialog, messages, chat_result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              chatId = req.body.chatId;
              token = req.cookies['token'];
              if (chatId) {
                _context5.next = 5;
                break;
              }
              return _context5.abrupt("return", new _ApiError["default"](res, 400, "Invalid chatId"));
            case 5:
              _context5.next = 7;
              return authController.getUser(token);
            case 7:
              user = _context5.sent;
              _context5.next = 10;
              return ChatController.getDialog(chatId, user);
            case 10:
              dialog = _context5.sent;
              if (!dialog) {
                _context5.next = 20;
                break;
              }
              _context5.next = 14;
              return prisma.message.findMany({
                where: {
                  dialogId: Number(chatId)
                }
              });
            case 14:
              messages = _context5.sent;
              chat_result = [];
              messages.forEach(function (item) {
                var msg = JSON.parse(item.message);
                var decrypt_message = (0, _CRYPTO_Manager.decrypt)(msg, dialog.secret);
                chat_result.push(_objectSpread(_objectSpread({}, item), {}, {
                  message: decrypt_message
                }));
              });
              res.json(chat_result);
              _context5.next = 21;
              break;
            case 20:
              res.send("Chat not found");
            case 21:
              _context5.next = 26;
              break;
            case 23:
              _context5.prev = 23;
              _context5.t0 = _context5["catch"](0);
              console.warn(_context5.t0.toString());
            case 26:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[0, 23]]);
      }));
      function getMessages(_x10, _x11, _x12) {
        return _getMessages.apply(this, arguments);
      }
      return getMessages;
    }()
  }, {
    key: "getDialogs",
    value: function () {
      var _getDialogs = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res, next) {
        var token, user, dialogs1, dialogs2;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              token = req.cookies['token'];
              _context6.next = 4;
              return authController.getUser(token);
            case 4:
              user = _context6.sent;
              _context6.next = 7;
              return prisma.dialog.findMany({
                where: {
                  user1: user
                }
              });
            case 7:
              dialogs1 = _context6.sent;
              _context6.next = 10;
              return prisma.dialog.findMany({
                where: {
                  user2: user
                }
              });
            case 10:
              dialogs2 = _context6.sent;
              res.json({
                "user1": dialogs1,
                "user2": dialogs2
              });
              _context6.next = 17;
              break;
            case 14:
              _context6.prev = 14;
              _context6.t0 = _context6["catch"](0);
              console.warn(_context6.t0.toString());
            case 17:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[0, 14]]);
      }));
      function getDialogs(_x13, _x14, _x15) {
        return _getDialogs.apply(this, arguments);
      }
      return getDialogs;
    }()
  }], [{
    key: "getDialog",
    value: function () {
      var _getDialog = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(chatId, user) {
        var dialog;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return prisma.dialog.findFirst({
                where: {
                  id: Number(chatId)
                }
              });
            case 3:
              dialog = _context7.sent;
              if (!(dialog.user1Id == user.id || dialog.user2Id == user.id)) {
                _context7.next = 8;
                break;
              }
              return _context7.abrupt("return", dialog);
            case 8:
              return _context7.abrupt("return", false);
            case 9:
              _context7.next = 14;
              break;
            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](0);
              return _context7.abrupt("return", false);
            case 14:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[0, 11]]);
      }));
      function getDialog(_x16, _x17) {
        return _getDialog.apply(this, arguments);
      }
      return getDialog;
    }()
  }]);
  return ChatController;
}();
exports["default"] = ChatController;