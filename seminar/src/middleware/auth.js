/**
 * uid/upwd - user transmitted id/pwd
 * rid/rpwd - server registered id/pwd
 */

const authMiddleware = (req, res, next) => {
  var { uid, upwd } = {
    uid: req.body.id, 
    upwd: req.body.pwd
  };
  var { rid, rpwd } = {
    rid: process.env.ID, 
    rpwd: process.env.PASSWORD
  };
    if (uid === rid && upwd === rpwd) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;