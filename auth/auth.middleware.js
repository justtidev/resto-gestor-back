

 const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('entro al authenticateToken middleware', authHeader);

  
  // por lo general el token se envia de esta manera:
  // Bearer eyJhbGciOiJIUzI1NiIsInR5...

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token requerido' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log("Token expirado, intentara refrescarlo");
        return res.status(401).json({ message: 'Token expirado' });
      }
      console.log("Token invalido", err.message);
      return res.status(403).json({ message: 'Token inválido' });
    }
    console.log("Decoded JWT", decoded);
    req.user = decoded; // decoded contiene los datos del usuario
    next();
  });
}

module.exports = { authenticateToken };