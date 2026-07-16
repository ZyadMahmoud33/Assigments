const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// custom validation method used inside the beforeCreate hook
function checkNameLength(user) {
  if (!user.name || user.name.length <= 2) {
    throw new Error('Name must be longer than 2 characters.');
  }
}

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkPasswordLength(value) {
          if (!value || value.length <= 6) {
            throw new Error('Password must be longer than 6 characters.');
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  },
  {
    tableName: 'Users',
    hooks: {
      beforeCreate: (user) => {
        checkNameLength(user);
      },
    },
  }
);

module.exports = User;
