const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            nickname: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
            photo: DataTypes.STRING,
            isLogged: DataTypes.BOOLEAN,
        }, { 
            sequelize,
            hooks: {
                beforeCreate: (user) => {
                    const salt = bcrypt.genSaltSync();
                    user.password = bcrypt.hashSync(user.password, salt);
                },
            },
         })
    }
}

module.exports = User;