const jwt = require("jsonwebtoken");

class AuthJwt {
  async authJwt(req, res, next) {
    try {
      const authHeader = req.headers["x-access-token"];
      // console.log("token",authHeader);
      if (!authHeader) {
        res.statusCode=404;
        res.statusMessage = "Unable to find Token";
      } else {
        jwt.verify(authHeader, process.env.SECRET_KEY, (err, data) => {
          //  console.log("token verify",data,err);
          if (err) {
            console.log("verification failed");
            res.statusCode=401;
            res.statusMessage = "Token verification failed ";
            next();
          } else {            
            req.user = data;
            next();
          }
        });        
      }
    } catch (err) {
      console.log("Error to verify token: ", err);
      next();
    }
  }
}

module.exports = new AuthJwt();