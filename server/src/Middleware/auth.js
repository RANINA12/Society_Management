const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
module.exports = router ;
