const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = "sdnbjsdbjh2BJ34BNB56?N5B76NBHJV98G0VCHG9C0SKJDBJKFJjkqshgvdhj";

module.exports = {
    generateTokenForUser: function(utilisateur) {
      return jwt.sign({
        utilisateurId: utilisateur.id,
        userEmail: utilisateur.email,
        profil: utilisateur.profile
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: '125487h'
      })
    },
    parseAuthorization: function(authorization) {
      return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    }
  }