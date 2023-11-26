const User = require('../models/User');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300,
    });
}

module.exports = {

    async login(req,res) {
        const {email, password, isLogged } = req.body;

        const user = await User.findOne({where: {email}});

        if(!user){
            return res.status(400).send({
                status:0,
                message: 'email ou senha incorrretos!'
            });
        }

        if(!bcrypt.compareSync(password, user.password)){
            return res.status(400).send({
                status:0,
                message: 'email ou senha incorrretos!'
            });
        }

        const user_id = user.id;

        await User.update({
            isLogged
        }, {
            where: {
                id: user_id
            }
        });

        user.password = undefined;
        
        const token = generateToken({id:user.id});

        console.log(user);
        console.log(token);

        return res.status(200).send({
            status: 1,
            message: 'usuario logado com sucesso!',
            user, token
        });



    },

    async index(req, res) {
        try {
          const users = await User.findAll({
            where: {
              isLogged: 1,
            },
          });
      
          if (!users || users.length === 0) {
            return res.status(200).send({ message: "Nenhum usuário logado." });
          }
      
          return res.status(200).send({ users });
        } catch (error) {
          console.error("Erro ao obter usuários:", error);
          return res.status(500).send({ message: "Erro interno do servidor." });
        }
      },      

    async store(req, res) {
        const {name, nickname, password, email, photo } = req.body;

        console.log(req.body);

        const user = await User.create({name, nickname, password, email, photo});

        const token = generateToken({id:user.id});

        return res.status(200).send({
            status:1,
            message: 'usuario cadastrado com sucesso!',
            user, token
        });
    },

    async update(req, res) {
        const {name, nickname, password, email, photo } = req.body;

        const {user_id} = req.params;

        await User.update({
            name, nickname, password, email, photo
        }, {
            where: {
                id: user_id
            }
        });

        return res.status(200).send({
            status:1,
            message: 'usuario atualizado com sucesso!'
        });
    },

    async delete(req, res) {
        const { user_id } = req.params;

        await User.destroy({
            where: {
                id: user_id
            }
        });

        return res.status(200).send({
            status:1,
            message: 'usuario deletado com sucesso!',
        });
    },

};