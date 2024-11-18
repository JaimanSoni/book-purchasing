const sequelize = require('../config/db');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Book = require('./Book');
const Admin = require('./Admin');

// Define relationships here, or in the model files
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Book, { foreignKey: 'book_id' });
Book.hasMany(OrderItem, { foreignKey: 'book_id' });

module.exports = {
  sequelize,
  User,
  Order,
  OrderItem,
  Book,
  Admin
};