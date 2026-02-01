const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // 1. Verify Token with Firebase
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.userUid = decodedToken.uid;
      req.userEmail = decodedToken.email;

      // 2. Find or Create User in MongoDB (Sync Logic)
      // We do this to ensure every authenticated request has a valid DB user attached
      let user = await User.findOne({ firebaseUID: req.userUid });
      
      if (!user) {
        user = await User.create({
          firebaseUID: req.userUid,
          email: req.userEmail,
          name: decodedToken.name || 'User',
          profileImageURL: decodedToken.picture || ''
        });
      }

      req.user = user; // Attach MongoDB user object to request
      next();
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };