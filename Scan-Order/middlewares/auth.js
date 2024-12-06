const { ValidateToken } = require("../service/authentication");

function checkForAuthAndRedirect(cookieName) {
  return (req, res, next) => {
    const tokenValue = req.cookies[cookieName];

    if (tokenValue) {
      try {
        const userPayload = ValidateToken(tokenValue);
        req.user = userPayload;
        return next();
      } catch (error) {
        console.log("middleware error", error);
        return next();
      }
    }
    else{
      return res.redirect('/user')
    }
  };
}

module.exports = {
  checkForAuthAndRedirect,
};
