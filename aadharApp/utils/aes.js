var aes256 = require("aes256");

var key = "123456";
var plaintext = "my plaintext message";

function cryptedMessage(plaintext, key) {
  var encryptedPlainText = aes256.encrypt(key, plaintext);

  var decryptedPlainText = aes256.decrypt(key, encryptedPlainText);

  console.log(encryptedPlainText);

  console.log(decryptedPlainText);
}

cryptedMessage(plaintext, key);
