const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { generateTokens } = require('../utils/tokenManager');
const { Order, OrderItem, User, Book } = require('../models');
const adminController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      const admin = await Admin.findOne({ where: { username } });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = {
        admin_id: admin.admin_id,
        username: admin.username
      };

      const { accessToken, refreshToken } = generateTokens(payload);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "None",
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        message: 'Login successful',
        accessToken,
        admin: {
          admin_id: admin.admin_id,
          username: admin.username,
          email: admin.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  },

  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      const existingUser = await Admin.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await Admin.create({ username, email, password: hashedPassword });

      return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error, please try again later' });
    }
  },
  
  async logout(req, res) {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
  },
  
  async getAllOrders(req, res) {
    try {

      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'enrollment_number'],
          },
          {
            model: OrderItem,
            include: {
              model: Book,
              attributes: ['title'],
            },
          },
        ],
      });

      const orderDetails = orders.map(order => {
        const user = order.User;
        const items = order.OrderItems;

        return {
          order_id: order.order_id,
          total_price: order.total_price,
          name: user.name,
          enrollment_number: user.enrollment_number,
          items: items.map(item => ({
            book_title: item.Book.title,
            quantity: item.quantity,
            price_per_item: item.price,
          })),
        };
      });

      res.status(200).json({ orders: orderDetails });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ message: 'Server error while fetching orders' });
    }
  },
};


module.exports = adminController;