const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = (req.cookies.AuthToken == undefined) ? req.header('x-auth-token') : req.cookies.AuthToken;
    if (!token) {
        return res.status(401).send('Access denied! No token provided.');
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Access denied! Invalid token.');
    }
}