"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _UtilController = _interopRequireDefault(require("@/App/Controller/UtilController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var utilController = new _UtilController["default"]();
router.get("/generatePassword", function (req, res) {
  res.send(utilController.generatePassword(32));
});
var _default = router;
exports["default"] = _default;