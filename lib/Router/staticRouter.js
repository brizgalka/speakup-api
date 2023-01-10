"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var file = _path["default"].join(__dirname, '/Kollet-iedgr.txt');
var useragree = _fs["default"].readFileSync(file, "utf-8");
router.get("/getUserLogo", function (req, res) {
  if (req.query == undefined) res.send("params not found");
  var username = req.query.username;
  console.log(username);
  res.sendFile(_path["default"].join(__dirname, "../../storage/users/default.png"));
});
router.get("/getUserAgree", function (req, res, next) {
  res.send(useragree);
});
var _default = router;
exports["default"] = _default;