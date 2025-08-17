const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;           
      req.userId = decoded.id;
      req.userRole = decoded.role;

      console.log("JWT role:", decoded.role);

      // role check
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: 'Access denied' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
  };
};
