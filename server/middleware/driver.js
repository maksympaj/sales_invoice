const jwt = require('express-jwt');
// const db = require('server/helper/db');

module.exports = driver;

function driver() {
  return [
    // authenticate JWT token and attach decoded token to request as req.user
    jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),

    // attach full user record to request object
    async (req, res, next) => {
      // get user with id from token 'sub' (subject) property
      const user = await db.User.findByPk(req.user.sub);

      // check user still exists
      if (
        !user ||
        !user.isActive ||
        (user.type !== 'driver' && user.type !== 'admin')
      )
        return res.status(401).json({ message: 'You are unauthorized!' });

      // authorization successful
      req.user = user.get();
      next();
    },
  ];
}
