const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const jwt = require("jsonwebtoken");
const {createAccessToken, createRefreshToken} =  require('../utils/tokenManager')
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
      };


      const accessToken = createAccessToken({ payload});
      const refreshToken = createRefreshToken({ payload });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: "/", 
        secure: true, 
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: 'Login successful',
        accessToken,
        admin: {
          admin_id: admin.admin_id,
          username: admin.username,
          email: admin.email
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Login failed', error: error.message });
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
      console.log(newUser);
      
      return res.status(201).json({ success:true, message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error(error);
      console.error("Error details:", error); // Log detailed error info
        
      return res.status(500).json({ success:false , message: 'Server error, please try again later' });
    }
  },
  
  async logout(req, res) {
    try {
      res.clearCookie('refreshtoken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error("Error during logout:", error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to logout. Please try again later.',
      });
    }
  },
  
  
  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: ['username', 'enrollment_number'],
          },
          {
            model: OrderItem,
            include: {
              model: Book,
              attributes: ['title'],
            },
          },
        ],
        attributes: ['order_id', 'total_price', 'ordered_at'],
        order: [['ordered_at', 'DESC']]
      });
  
      const orderDetails = orders.map(order => {
        const user = order.User;
        const items = order.OrderItems;
  
        // Simple date formatting
        const orderedDate = order.ordered_at ? new Date(order.ordered_at) : null;
        const formattedDate = orderedDate ? 
          `${orderedDate.getDate()}/${orderedDate.getMonth() + 1}/${orderedDate.getFullYear()} ${String(orderedDate.getHours()).padStart(2, '0')}:${String(orderedDate.getMinutes()).padStart(2, '0')}` 
          : 'N/A';
  
        return {
          order_id: order.order_id,
          total_price: order.total_price,
          name: user.username,
          enrollment_number: user.enrollment_number,
          ordered_at: formattedDate,
          items: items.map(item => ({
            book_title: item.Book.title,
            quantity: item.quantity,
            price_per_item: item.price,
          })),
        };
      });
  
      res.status(200).json({
        success: true,
        orders: orderDetails
      });
  
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  },

  async refreshAccessToken(req, res) {
    console.log("Refresh token received:", req.cookies.refreshToken);
    const refreshtoken = req.cookies.refreshtoken;
    
  
    if (!refreshtoken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
  
    jwt.verify(
      refreshtoken,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(403).json({success:false ,  message: "Refresh token expired, please log in again" });
          }
          return res.status(401).json({success:false , message: "Invalid refresh token" });
        }
  
        // If valid, create a new access token
        const accessToken = createAccessToken({ id: decoded.id });
        res.status(200).json({success:true ,  accessToken });
      }
    );
  },
  
  async getAllAdmin(req, res) {
    try {
     
      const admins = await Admin.findAll({
        attributes: ['admin_id', 'username', 'email', 'created_at'], 
      });

      return res.status(200).json({
        success: true,
        admins,
      });
    } catch (error) {
      console.error("Error fetching admins:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch admins",
        error: error.message,
      });
    }
  },
  async deleteAdmin(req, res) {
    try {
      const { id } = req.params; 

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Admin ID is required to delete an admin",
        });
      }

      const admin = await Admin.findByPk(id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      await admin.destroy();

      return res.status(200).json({
        success: true,
        message: `Admin with ID ${id} has been deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting admin:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to delete admin",
        error: error.message,
      });
    }
  },
  
};


module.exports = adminController;