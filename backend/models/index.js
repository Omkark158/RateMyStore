const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// <---------------- Associations ---------------->

// A User can own many Stores
User.hasMany(Store, {
  as: "stores",
  foreignKey: "ownerId",
  onDelete: "CASCADE",    
  hooks: true            
});
Store.belongsTo(User, {
  as: "owner",
  foreignKey: "ownerId"
});

// A Store can have many Ratings
Store.hasMany(Rating, {
  foreignKey: "storeId",
  onDelete: "CASCADE",   
  hooks: true
});
Rating.belongsTo(Store, { foreignKey: "storeId" });

// A Rating belongs to a User
Rating.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Store,
  Rating
};
