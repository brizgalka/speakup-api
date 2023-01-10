"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _crypto = require("crypto");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var PassPhrase = process.env.RSA_PassPhrase;
var Bits = Number(process.env.RSA_Bits);
var RSA_Manager = /*#__PURE__*/function () {
  function RSA_Manager() {
    _classCallCheck(this, RSA_Manager);
  }
  _createClass(RSA_Manager, null, [{
    key: "encryptWithRSA",
    value: function encryptWithRSA(input, publicKey) {
      var buffer = Buffer.from(input, 'utf-8');
      var encrypted = (0, _crypto.publicEncrypt)(publicKey, buffer);
      return encrypted.toString("base64");
    }
  }, {
    key: "decryptWithRSA",
    value: function decryptWithRSA(input, privatekey) {
      var buffer = Buffer.from(input, 'base64');
      var decrypted = (0, _crypto.privateDecrypt)({
        key: privatekey,
        passphrase: PassPhrase
      }, buffer);
      return decrypted.toString("utf8");
    }
  }, {
    key: "generateKey",
    value: function generateKey() {
      return (0, _crypto.generateKeyPairSync)('rsa', {
        modulusLength: Bits,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: PassPhrase
        }
      });
    }
  }, {
    key: "privateKeyToString",
    value: function privateKeyToString(privateKey) {
      return privateKey.split("\n").slice(1, 17).join();
    }
  }, {
    key: "publicKeyToString",
    value: function publicKeyToString(publicKey) {
      return publicKey.split("\n").slice(1, 5).join();
    }
  }]);
  return RSA_Manager;
}();
exports["default"] = RSA_Manager;