"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genSecret = exports.encrypt = exports.decrypt = void 0;
var _crypto = _interopRequireDefault(require("crypto"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var algorithm = String(process.env.crypto_algorithm);
var genSecret = function genSecret(size) {
  return _crypto["default"].randomBytes(size).toString("hex");
};
exports.genSecret = genSecret;
var encrypt = function encrypt(text, secretKey) {
  var iv = _crypto["default"].randomBytes(16);
  var cipher = _crypto["default"].createCipheriv(algorithm, secretKey, iv);
  var encrypted = Buffer.concat([cipher.update(text), cipher["final"]()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};
exports.encrypt = encrypt;
var decrypt = function decrypt(hash, secretKey) {
  var decipher = _crypto["default"].createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  var decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher["final"]()]);
  return decrpyted.toString();
};
exports.decrypt = decrypt;