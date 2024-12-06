const JWT = require("jsonwebtoken");

secretKey = "ajskdd3s56ejs$id3jwer,sdfni%jbjf7&";

function generateJWT(user) {
  const payload = {
    _id: user._id,
    userName: user.fullname,
    role: user.role,
  };
  const token = JWT.sign(payload, secretKey);

  return token;
}

function ValidateToken(token) {
  try {
    const payload = JWT.verify(token, secretKey);
    return payload;
  } catch (error) {
    console.error("Token validation error:", error.message);
  }
}

module.exports = {
  generateJWT,
  ValidateToken,
};
