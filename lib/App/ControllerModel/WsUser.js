"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserStatus = void 0;
var UserStatus;
exports.UserStatus = UserStatus;
(function (UserStatus) {
  UserStatus[UserStatus["VERIFICATION"] = 1] = "VERIFICATION";
  UserStatus[UserStatus["IDLING"] = 2] = "IDLING";
  UserStatus[UserStatus["PENDING"] = 3] = "PENDING";
})(UserStatus || (exports.UserStatus = UserStatus = {}));