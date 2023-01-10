"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _client = require("@prisma/client");
var _ApiError = _interopRequireDefault(require("@/App/error/ApiError"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _Context = require("@/System/Context");
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _uuid = require("uuid");
var _AuthModel = _interopRequireDefault(require("@/App/model/AuthModel"));
var _modelResponse = _interopRequireDefault(require("@/App/model/modelResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var prisma = new _client.PrismaClient();
var saltRounds = Number(process.env.saltRounds);
var token_secret = String(process.env.JWT_SECRET);
var authModel = new _AuthModel["default"]();
var jwtMaxAge = Number(process.env.jwtMaxAge);
var AuthController = /*#__PURE__*/function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }
  _createClass(AuthController, [{
    key: "registration",
    value: function () {
      var _registration = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res, next) {
        var _req$body, username, password, email, user_uuid, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              if (!(req.body == undefined)) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid Body")));
            case 3:
              _req$body = req.body, username = _req$body.username, password = _req$body.password, email = _req$body.email;
              user_uuid = req.body.uuid;
              if (user_uuid) {
                _context.next = 7;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "Invalid UUID"));
            case 7:
              if (username) {
                _context.next = 9;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "Invalid username"));
            case 9:
              if (password) {
                _context.next = 11;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "Invalid password"));
            case 11:
              if (email) {
                _context.next = 13;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "Invalid email"));
            case 13:
              if (_Context.ApplicationContext.wss.verifyUUID(user_uuid)) {
                _context.next = 15;
                break;
              }
              return _context.abrupt("return", new _ApiError["default"](res, 400, "Invalid user_uuid"));
            case 15:
              _context.next = 17;
              return authModel.registration(username, password, email, user_uuid);
            case 17:
              result = _context.sent;
              _modelResponse["default"].responseRequest(res, result);
              _context.next = 25;
              break;
            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](0);
              console.warn(_context.t0.toString());
              res.sendStatus(500);
            case 25:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 21]]);
      }));
      function registration(_x, _x2, _x3) {
        return _registration.apply(this, arguments);
      }
      return registration;
    }()
  }, {
    key: "validateVerifyToken",
    value: function () {
      var _validateVerifyToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
        var verifyToken, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              if (!(req.body == undefined)) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid body")));
            case 3:
              verifyToken = req.body.verifyToken;
              if (verifyToken) {
                _context2.next = 6;
                break;
              }
              return _context2.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid verifyToken")));
            case 6:
              _context2.next = 8;
              return _Context.ApplicationContext.redis.get(verifyToken);
            case 8:
              result = _context2.sent;
              if (result) {
                res.sendStatus(200);
              } else {
                res.sendStatus(500);
              }
              _context2.next = 15;
              break;
            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](0);
              console.warn(_context2.t0.toString());
            case 15:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 12]]);
      }));
      function validateVerifyToken(_x4, _x5, _x6) {
        return _validateVerifyToken.apply(this, arguments);
      }
      return validateVerifyToken;
    }()
  }, {
    key: "verifyAccount",
    value: function () {
      var _verifyAccount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(token, telegram) {
        var user_candidate, user_token, user_uuid_connection;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return prisma.user.findUnique({
                where: {
                  telegram: telegram
                }
              });
            case 3:
              user_candidate = _context3.sent;
              if (!(user_candidate != null)) {
                _context3.next = 6;
                break;
              }
              return _context3.abrupt("return", "Аккаунт уже привязан");
            case 6:
              _context3.next = 8;
              return prisma.verifyToken.findFirst({
                where: {
                  value: token
                }
              });
            case 8:
              user_token = _context3.sent;
              if (!(user_token == null)) {
                _context3.next = 13;
                break;
              }
              return _context3.abrupt("return", "Неизвестный токен");
            case 13:
              _context3.next = 15;
              return prisma.user.create({
                data: {
                  username: user_token.username,
                  email: user_token.email,
                  password: user_token.password,
                  salt: user_token.salt,
                  createdAt: new Date(),
                  telegram: telegram
                }
              });
            case 15:
              _context3.next = 17;
              return prisma.verifyToken["delete"]({
                where: {
                  value: token
                }
              });
            case 17:
              _context3.next = 19;
              return _Context.ApplicationContext.redis.get(token);
            case 19:
              user_uuid_connection = _context3.sent;
              console.log(user_uuid_connection);
              console.log(_Context.ApplicationContext.wss);
              if (user_uuid_connection != null) {
                if (_Context.ApplicationContext.wss.verifyUUID(user_uuid_connection)) {
                  _Context.ApplicationContext.wss.sendMessage(user_uuid_connection, {
                    "verify": {
                      "status": "ok"
                    }
                  });
                }
              }
              _context3.next = 25;
              return _Context.ApplicationContext.redis.del(token);
            case 25:
              return _context3.abrupt("return", "Аккаунт успешно создан и привязан к вашему телеграмм!");
            case 26:
              _context3.next = 31;
              break;
            case 28:
              _context3.prev = 28;
              _context3.t0 = _context3["catch"](0);
              console.warn(_context3.t0.toString());
            case 31:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[0, 28]]);
      }));
      function verifyAccount(_x7, _x8) {
        return _verifyAccount.apply(this, arguments);
      }
      return verifyAccount;
    }()
  }, {
    key: "getUser",
    value: function () {
      var _getUser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(jwtoken) {
        var decoded, username, user;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              decoded = _jsonwebtoken["default"].verify(jwtoken, token_secret);
              if (!(decoded != undefined)) {
                _context4.next = 8;
                break;
              }
              username = decoded.username;
              _context4.next = 6;
              return prisma.user.findFirst({
                where: {
                  username: username
                }
              });
            case 6:
              user = _context4.sent;
              return _context4.abrupt("return", user);
            case 8:
              _context4.next = 13;
              break;
            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](0);
              console.warn(_context4.t0.toString());
            case 13:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[0, 10]]);
      }));
      function getUser(_x9) {
        return _getUser.apply(this, arguments);
      }
      return getUser;
    }()
  }, {
    key: "forgotPassword",
    value: function () {
      var _forgotPassword = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res, next) {
        var username, user_uuid, user, salt, uuid1, hash, uuid2, hash_id;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              if (!(req.body == undefined)) {
                _context5.next = 3;
                break;
              }
              return _context5.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid body")));
            case 3:
              username = req.body.username;
              user_uuid = req.body.uuid;
              if (username) {
                _context5.next = 7;
                break;
              }
              return _context5.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid username")));
            case 7:
              _context5.next = 9;
              return prisma.user.findFirst({
                where: {
                  username: username
                }
              });
            case 9:
              user = _context5.sent;
              if (!(user == null)) {
                _context5.next = 12;
                break;
              }
              return _context5.abrupt("return", next(new _ApiError["default"](res, 400, "Wrong username")));
            case 12:
              salt = _bcrypt["default"].genSaltSync(saltRounds);
              uuid1 = (0, _uuid.v4)();
              hash = _bcrypt["default"].hashSync(user_uuid, salt);
              uuid2 = (0, _uuid.v4)();
              hash_id = (uuid1 + hash + uuid2).replace("/", ".");
              _context5.next = 19;
              return _Context.ApplicationContext.redis.set(hash_id, user.username);
            case 19:
              _context5.next = 21;
              return _Context.ApplicationContext.tgBot.bot.sendMessage(user.telegram, "hello, your reset link\n                http://82.146.46.97:3000/auth/forgot-password/auth-new-password/".concat(hash_id, "\n            "));
            case 21:
              res.send("Code sent to your telegram");
              _context5.next = 28;
              break;
            case 24:
              _context5.prev = 24;
              _context5.t0 = _context5["catch"](0);
              console.warn(_context5.t0.toString());
              res.sendStatus(500);
            case 28:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[0, 24]]);
      }));
      function forgotPassword(_x10, _x11, _x12) {
        return _forgotPassword.apply(this, arguments);
      }
      return forgotPassword;
    }()
  }, {
    key: "validateHashId",
    value: function () {
      var _validateHashId = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res, next) {
        var hashId, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              if (!(req.body == undefined)) {
                _context6.next = 3;
                break;
              }
              return _context6.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid body")));
            case 3:
              hashId = req.body.hashId;
              if (hashId) {
                _context6.next = 6;
                break;
              }
              return _context6.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid hashId")));
            case 6:
              _context6.next = 8;
              return _Context.ApplicationContext.redis.get(hashId);
            case 8:
              result = _context6.sent;
              if (!result) {
                _context6.next = 13;
                break;
              }
              res.sendStatus(200);
              _context6.next = 14;
              break;
            case 13:
              return _context6.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid hashId")));
            case 14:
              _context6.next = 20;
              break;
            case 16:
              _context6.prev = 16;
              _context6.t0 = _context6["catch"](0);
              console.warn(_context6.t0.toString());
              res.sendStatus(500);
            case 20:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[0, 16]]);
      }));
      function validateHashId(_x13, _x14, _x15) {
        return _validateHashId.apply(this, arguments);
      }
      return validateHashId;
    }()
  }, {
    key: "newPassword",
    value: function () {
      var _newPassword = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res, next) {
        var _req$body2, _newPassword2, hashId, username, salt, hash_password, user;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              if (!(req.body == undefined)) {
                _context7.next = 3;
                break;
              }
              return _context7.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid body")));
            case 3:
              _req$body2 = req.body, _newPassword2 = _req$body2.newPassword, hashId = _req$body2.hashId;
              if (_newPassword2) {
                _context7.next = 6;
                break;
              }
              return _context7.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid newPassword")));
            case 6:
              if (hashId) {
                _context7.next = 8;
                break;
              }
              return _context7.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid hashId")));
            case 8:
              _context7.next = 10;
              return _Context.ApplicationContext.redis.get(hashId);
            case 10:
              username = _context7.sent;
              if (username) {
                _context7.next = 13;
                break;
              }
              return _context7.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid hashId")));
            case 13:
              salt = _bcrypt["default"].genSaltSync(saltRounds);
              hash_password = _bcrypt["default"].hashSync(_newPassword2, salt);
              _context7.next = 17;
              return prisma.user.update({
                where: {
                  username: username
                },
                data: {
                  password: hash_password,
                  salt: salt
                }
              });
            case 17:
              user = _context7.sent;
              _context7.next = 20;
              return _Context.ApplicationContext.redis.del(hashId);
            case 20:
              res.send(200);
              _context7.next = 27;
              break;
            case 23:
              _context7.prev = 23;
              _context7.t0 = _context7["catch"](0);
              console.warn(_context7.t0.toString());
              res.sendStatus(500);
            case 27:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[0, 23]]);
      }));
      function newPassword(_x16, _x17, _x18) {
        return _newPassword.apply(this, arguments);
      }
      return newPassword;
    }()
  }, {
    key: "changePassword",
    value: function () {
      var _changePassword = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res, next) {
        var _req$body3, oldPassword, newPassword, token, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              if (!(req.body == undefined)) {
                _context8.next = 3;
                break;
              }
              return _context8.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid body")));
            case 3:
              _req$body3 = req.body, oldPassword = _req$body3.oldPassword, newPassword = _req$body3.newPassword;
              token = req.cookies['token'];
              if (oldPassword) {
                _context8.next = 7;
                break;
              }
              return _context8.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid oldPassword")));
            case 7:
              if (newPassword) {
                _context8.next = 9;
                break;
              }
              return _context8.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid newPassword")));
            case 9:
              if (token) {
                _context8.next = 11;
                break;
              }
              return _context8.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid token")));
            case 11:
              _context8.next = 13;
              return authModel.changePassword(token, oldPassword, newPassword);
            case 13:
              result = _context8.sent;
              _modelResponse["default"].responseRequest(res, result);
              _context8.next = 20;
              break;
            case 17:
              _context8.prev = 17;
              _context8.t0 = _context8["catch"](0);
              res.sendStatus(500);
            case 20:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[0, 17]]);
      }));
      function changePassword(_x19, _x20, _x21) {
        return _changePassword.apply(this, arguments);
      }
      return changePassword;
    }()
  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res, next) {
        var _req$body4, username, password, result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              if (!(req.body == undefined)) {
                _context9.next = 3;
                break;
              }
              return _context9.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid body")));
            case 3:
              _req$body4 = req.body, username = _req$body4.username, password = _req$body4.password;
              if (username) {
                _context9.next = 6;
                break;
              }
              return _context9.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid username")));
            case 6:
              if (password) {
                _context9.next = 8;
                break;
              }
              return _context9.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid password")));
            case 8:
              _context9.next = 10;
              return authModel.login(username, password);
            case 10:
              result = _context9.sent;
              _modelResponse["default"].responseRequest(res, result);
              _context9.next = 18;
              break;
            case 14:
              _context9.prev = 14;
              _context9.t0 = _context9["catch"](0);
              console.warn(_context9.t0.toString());
              res.sendStatus(500);
            case 18:
            case "end":
              return _context9.stop();
          }
        }, _callee9, null, [[0, 14]]);
      }));
      function login(_x22, _x23, _x24) {
        return _login.apply(this, arguments);
      }
      return login;
    }()
  }, {
    key: "logOut",
    value: function () {
      var _logOut = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res, next) {
        var token, result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              token = req.cookies['token'];
              if (!(token == undefined)) {
                _context10.next = 4;
                break;
              }
              return _context10.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid token")));
            case 4:
              _context10.next = 6;
              return authModel.logOut(token);
            case 6:
              result = _context10.sent;
              _modelResponse["default"].responseRequest(res, result);
              _context10.next = 13;
              break;
            case 10:
              _context10.prev = 10;
              _context10.t0 = _context10["catch"](0);
              console.warn(_context10.t0.toString());
            case 13:
            case "end":
              return _context10.stop();
          }
        }, _callee10, null, [[0, 10]]);
      }));
      function logOut(_x25, _x26, _x27) {
        return _logOut.apply(this, arguments);
      }
      return logOut;
    }()
  }, {
    key: "checkToken",
    value: function () {
      var _checkToken = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res, next) {
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              if (!(req.body == undefined)) {
                _context11.next = 3;
                break;
              }
              return _context11.abrupt("return", next(new _ApiError["default"](res, 400, "Invalid body")));
            case 3:
              res.send("auth");
              _context11.next = 9;
              break;
            case 6:
              _context11.prev = 6;
              _context11.t0 = _context11["catch"](0);
              console.warn(_context11.t0.toString());
            case 9:
            case "end":
              return _context11.stop();
          }
        }, _callee11, null, [[0, 6]]);
      }));
      function checkToken(_x28, _x29, _x30) {
        return _checkToken.apply(this, arguments);
      }
      return checkToken;
    }()
  }]);
  return AuthController;
}();
var _default = AuthController;
exports["default"] = _default;