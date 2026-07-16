const CryptoJS = require("crypto-js");
require("dotenv").config();

const secretKey = process.env.PHONE_SECRET_KEY;

const encryptPhone = (phone) => {
  return CryptoJS.AES.encrypt(phone, secretKey).toString();
};

const decryptPhone = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptPhone, decryptPhone };
