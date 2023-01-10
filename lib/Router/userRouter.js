"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _ChatController = _interopRequireDefault(require("@/App/Controller/ChatController"));
var _UserController = _interopRequireDefault(require("@/App/Controller/UserController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var userController = new _UserController["default"]();
var chatController = new _ChatController["default"]();
router.post("/sendMessage", chatController.sendMessage);
router.post("/deleteMessage", chatController.deleteMessage);
router.post("/createChat", chatController.createChat);
router.get("/getUserData", userController.getUserData);
router.post("/getMessages", chatController.getMessages);
router.post("/getDialogs", chatController.getDialogs);
router.post("/getDialogInfo", chatController.getDialogInfo);
router.post("/changePhoto", userController.changePhoto);
router.post("/changeBio", userController.changeBio);
var _default = router;
exports["default"] = _default;