const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')


const generatetoken = (params = {}) => { //funcao pra gerar o token
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}


router.post('/register', async (req, res) => {
    
    const { email } = req.body //requisitando o email do objeto

    try {
        if(await User.findOne({email})) //verificando se o email já existe
            return res.status(400).send({ error: 'E-mail já cadastrado'})

        const user = await User.create(req.body)

        user.password = undefined // tirando senha de retorno API

        return res.send({ 
            user, 
            token: generatetoken ({id: user.id}) 
        })
    }
    catch (err){
        return res.status(400).send({ error: 'Registro falhou' })
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')//uso o select pois no objeto ele ta como false para retornar na api

    if(!user)//verifica o email do usuario
        return res.status(400).send({ error: "Usuário não encontrado" })

    if(!await bcrypt.compare(password, user.password))//compara se a senha digitada é a mesma registrada
        return res.status(400).send({ error: 'Senha Inválida' })

    user.password = undefined

    res.send({ 
        user, 
        token: generatetoken ({id: user.id}) 
    })
})

module.exports = app => app.use('/auth', router);