const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [20, 60], notEmpty: true }
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",   
      key: "id"
    },
    onDelete: "CASCADE"
  }
});

module.exports = Store;
