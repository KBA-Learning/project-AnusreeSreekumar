import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config();

const SecretKey = process.env.secretKey

const authenticate = (req, res, next) => {

  const token = req.cookies.AuthToken; // Retrieve token from cookies
  if (!token) {
    console.log('No AuthToken found in cookies');
    return res.status(401).json({ message: 'Authentication token not found' });
  }

  try {
    // Verify the token
    const tokenVerification = jwt.verify(token, SecretKey);

    // Attach user details to the request object
    req.username = tokenVerification.username;
    req.userrole = tokenVerification.userrole;    

    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Error verifying token: ', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export { authenticate };
