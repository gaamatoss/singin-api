//criando middleware para fazer a validcao do token
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: "Nenhum token encontrado" });

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ error: "Erro de token" })

    const [ scheme, token ] = parts

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token mal formatado" })

    jwt.verify(token, authConfig.secret, (err, decoded) => {//recebe variavel decoded que é o id do user
        if(err)
            return res.status(401).send({ error: "Token invalido"})
            
        req.userId = decoded.id;
        return next();
        })
};