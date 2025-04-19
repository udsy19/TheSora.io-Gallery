const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const jwksClient = require('jwks-rsa');
const config = require('../config/config');

// Initialize a JWKS client
const client = jwksClient({
  jwksUri: `https://dev-g8taohq4go3564mr.us.auth0.com/.well-known/jwks.json`,
  requestHeaders: {
    // Add auth headers if needed
  },
  timeout: 30000 // 30 sec timeout
});

// Auth0 Management API Token (for admin operations if needed)
const getAuth0ManagementToken = async () => {
  try {
    const options = {
      method: 'POST',
      url: `https://${config.AUTH0_DOMAIN}/oauth/token`,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        client_id: config.AUTH0_CLIENT_ID,
        client_secret: config.AUTH0_CLIENT_SECRET,
        audience: `https://${config.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials'
      })
    };
    
    // This function is not called by default, but available if needed
    // You would need to use a fetch library or similar to make this request
    return { getToken: () => options };
  } catch (error) {
    console.error('Error getting Auth0 management token:', error);
    throw error;
  }
};

// Function to get the signing key
const getSigningKey = async (kid) => {
  const getSigningKeyAsync = promisify(client.getSigningKey);
  const key = await getSigningKeyAsync(kid);
  const signingKey = key.getPublicKey();
  return signingKey;
};

// Middleware to verify Auth0 tokens
exports.verifyAuth0Token = async (req, res, next) => {
  // Get token from header
  const bearerHeader = req.headers.authorization;
  
  if (!bearerHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authorization header missing'
    });
  }
  
  // Check if bearer token
  if (!bearerHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Token must be a Bearer token'
    });
  }
  
  // Extract token
  const token = bearerHeader.split(' ')[1];
  
  try {
    // Decode token to get kid (Key ID)
    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded || !decoded.header || !decoded.header.kid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    // Get the signing key
    const signingKey = await getSigningKey(decoded.header.kid);
    
    // Verify token
    const verifiedToken = jwt.verify(token, signingKey, {
      audience: config.AUTH0_AUDIENCE,
      issuer: `https://dev-g8taohq4go3564mr.us.auth0.com/`,
      algorithms: ['RS256']
    });
    
    // Add user to request
    req.user = {
      id: verifiedToken.sub,
      email: verifiedToken.email,
      name: verifiedToken.name,
      // You can map Auth0 roles to your app roles if needed
      role: verifiedToken['https://thesora.io/roles'] || 'user'
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Middleware to check for admin role
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  
  next();
};