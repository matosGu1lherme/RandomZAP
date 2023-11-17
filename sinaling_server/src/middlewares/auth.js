const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

module.exports = (res, req, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).send({error: 'sem token'});
    }
    const parts = authHeader.split(' ');

    if(!parts.lenght == 2) {
        return res.status(401).send({error: 'token errado'});
    }

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({error: 'token mal formado'});
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({error: 'token invalido'});

        req.userId = decoded.id;
        console.log(jwt.decoded.id)

        return next();
    });
};