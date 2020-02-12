const jwt = require("jsonwebtoken");
const JwtToken = require("../../api/models/jwttoken");

module.exports = async (req, res, next) => {
  try {
    console.log(req.params.id);

    const result = await JwtToken.findById(req.params.id);
    console.log(result);

    if (!result) {
      return res.status(401).redirect("/api/users/login");
    }

    const varified = jwt.verify(result.token, process.env.TOKEN_SECRET);
    req.user = varified;
    req.session.user_name = result.name;

    next();
  } catch (err) {
    res.status(400).redirect("/api/users/login");
  }
};
