const { sequelize, User, Order, OrderItem, Book } = require('../models');
const { sendConfirmationEmail } = require('../utils/emailService');

// Controller to place an order
const placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction(); 
  let transactionActive = true;

  try {
    const { userData, orderDetails, items } = req.body;
    

    let user = await User.findOne({ where: { email: userData.email }, transaction });
    if (!user) {
      user = await User.create(userData, { transaction });
    }

    const order = await Order.create({
      user_id: user.user_id,
      total_price: orderDetails.total_price,
    }, { transaction });

    for (const item of items) {
      const book = await Book.findByPk(item.book_id, { transaction });
      if (!book) {
        throw new Error(`Book with ID ${item.book_id} not found`);
      }

      if (book.stock < item.quantity) {
        throw new Error(`Insufficient stock for book ID ${item.book_id}`);
      }

      await book.update({ stock: book.stock - item.quantity }, { transaction });

      await OrderItem.create({
        order_id: order.order_id,
        book_id: item.book_id,
        quantity: item.quantity,
        price: item.price,
      }, { transaction });
    }

    await transaction.commit();
    transactionActive = false;
let orderDetailsHTML = `
  <p><strong>Order ID:</strong> ${order.order_id}</p>
  <p><strong>Total Price:</strong> ₹${orderDetails.total_price.toFixed(2)}</p>
  <h4>Order Items:</h4>
`;

for (const item of items) {
  const book = await Book.findByPk(item.book_id); 
  orderDetailsHTML += `<p>${book.title} (x${item.quantity}) - ₹${item.price.toFixed(2)} each</p>`;
}

orderDetailsHTML += `<p>Thank you for your purchase!</p>`;

const emailSent = await sendConfirmationEmail(user.email, orderDetailsHTML);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order_id: order.order_id,
    });
  } catch (error) {
    if (transactionActive) {
      await transaction.rollback();
    }
    console.error('Error placing order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message,
    });
  }
};

module.exports = { placeOrder };
