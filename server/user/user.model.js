const { DataTypes } = require('sequelize');
const sequelize = require('../../index.model');

const Users = sequelize.define('Users', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'Users',
});

module.exports = Users;