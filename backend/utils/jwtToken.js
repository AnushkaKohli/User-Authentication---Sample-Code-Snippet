//Creating token and saving in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //Options for cookie
  const options = {
    expires: new Date(
      //COOKIE_EXPIRE is in days so converted to msec as 24hrs, 60min, 60sec, 1000msec
      Date.now() + process.env.COOKIE_EXPIRE * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
