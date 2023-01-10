"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _AuthController = _interopRequireDefault(require("@/App/Controller/AuthController"));
var _express = _interopRequireDefault(require("express"));
var _AuthMiddleware = _interopRequireDefault(require("@/App/middleware/AuthMiddleware"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var authController = new _AuthController["default"]();
router.post("/logout", authController.logOut);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/register", authController.registration);
router.post("/checkToken", _AuthMiddleware["default"], authController.checkToken);
router.post("/new-password", authController.newPassword);
router.post("/validate-hashId", authController.validateHashId);
router.post("/validate-verifyToken", authController.validateVerifyToken);
router.post("/change-password", _AuthMiddleware["default"], authController.changePassword);
router.post("/verify-user", function (req, res) {
  authController.verifyAccount(req.body.token, Math.random().toString());
  res.status(200).send("ok");
});
var _default = router;
exports["default"] = _default;