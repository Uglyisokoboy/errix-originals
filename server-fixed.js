const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://errixoriginals.com',
    'https://www.errixoriginals.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ericprecious38:ericprecious38@cluster0.xruixya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  createdAt: { type: Date, default: Date.now },
  bio: { type: String, default: '' },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});
const User = mongoose.model('User', userSchema);

// Order schema
const orderProductSchema = new mongoose.Schema({
  productId: String,
  name: String,
  image: String,
  quantity: Number,
  price: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user email for simplicity
  products: [orderProductSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  donation: { type: Number, default: 0 },
});
const Order = mongoose.model('Order', orderSchema);

// In-memory storage for products
let products = [
  {
    id: 1,
    name: 'Signature Sandal',
    price: 9380,
    description: 'Handmade sandal with premium materials.',
    image: 'https://via.placeholder.com/280?text=Signature+Sandal'
  },
  {
    id: 2,
    name: 'Dignity Slide',
    price: 7500,
    description: 'Comfortable slide for everyday wear.',
    image: 'https://via.placeholder.com/280?text=Dignity+Slide'
  },
  {
    id: 3,
    name: 'Classic Loafer',
    price: 12000,
    description: 'Classic loafer for formal occasions.',
    image: 'https://via.placeholder.com/280?text=Classic+Loafer'
  },
  {
    id: 4,
    name: 'Urban Mule',
    price: 8500,
    description: 'Trendy mule for urban style.',
    image: 'https://via.placeholder.com/280?text=Urban+Mule'
  },
  {
    id: 5,
    name: 'Heritage Boot',
    price: 15000,
    description: 'Durable boot with heritage design.',
    image: 'https://via.placeholder.com/280?text=Heritage+Boot'
  },
  {
    id: 6,
    name: 'Minimalist Flip',
    price: 5000,
    description: 'Minimalist flip-flop for casual comfort.',
    image: 'https://via.placeholder.com/280?text=Minimalist+Flip'
  }
];

// In-memory storage for campaigns
let campaigns = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    caption: 'School Kit Distribution',
    description: 'Providing essential supplies to students in need'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    caption: 'Community Workshop',
    description: 'Empowering local communities through skill development'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
    caption: 'Mentorship Program',
    description: 'Building futures through guidance and support'
  }
];

// In-memory storage for users (demo only)
// let users = []; // This line is removed as per the edit hint.

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { fullName, email, password, phone, gender, bio, address, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword, phone, gender, bio, address, role });
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      createdAt: user.createdAt,
      bio: user.bio,
      address: user.address,
      role: user.role
    }});
  } catch (err) {
    res.status(500).json({ success: false, error: 'Registration failed.' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    // Force admin role for the admin email
    if (email === 'errixoriginals@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('Admin role enforced for', email);
    }
    console.log('User login:', email, 'Role:', user.role);
    const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed.' });
  }
});

// Get current user (demo: token is email)
app.get('/api/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const user = await User.findOne({ email: token });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid token' });
    res.json({ success: true, user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      createdAt: user.createdAt,
      bio: user.bio,
      address: user.address
    }});
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch user.' });
  }
});

// Update profile endpoint
app.post('/api/update-profile', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const user = await User.findOne({ email: token });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid token' });
    const { fullName, email, password, phone, gender, bio, address } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });
    if (email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
    }
    user.fullName = fullName || user.fullName;
    user.email = email;
    if (password) user.password = password;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    if (typeof bio === 'string') user.bio = bio;
    if (address && typeof address === 'object') {
      user.address = {
        street: address.street || user.address.street,
        city: address.city || user.address.city,
        state: address.state || user.address.state,
        postalCode: address.postalCode || user.address.postalCode,
        country: address.country || user.address.country,
      };
    }
    await user.save();
    res.json({ success: true, user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      createdAt: user.createdAt,
      bio: user.bio,
      address: user.address
    }});
  } catch (err) {
    res.status(500).json({ success: false, error: 'Update failed.' });
  }
});

// Routes

// GET all products
app.get('/api/products', (req, res) => {
  console.log('GET /api/products - Returning', products.length, 'products');
  res.json(products);
});

// POST new product
app.post('/api/products', upload.single('image'), (req, res) => {
  console.log('POST /api/products - Creating new product');
  
  if (!req.file) {
    return res.json({ success: false, error: 'Image required' });
  }
  
  const { name, price, description } = req.body;
  if (!name || !price) {
    return res.json({ success: false, error: 'Name and price required' });
  }
  
  const newId = Math.max(...products.map(p => p.id)) + 1;
  const product = {
    id: newId,
    name,
    price: parseFloat(price),
    description: description || '',
    image: req.file.filename
  };
  
  products.push(product);
  console.log('Created product:', product);
  
  res.json({ success: true, product });
});

// PUT update product
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const id = parseInt(req.params.id);
  console.log('PUT /api/products/' + id + ' - Updating product');
  
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.json({ success: false, error: 'Product not found' });
  }
  
  const { name, price, description } = req.body;
  if (!name || !price) {
    return res.json({ success: false, error: 'Name and price required' });
  }
  
  // Update product
  products[productIndex] = {
    ...products[productIndex],
    name,
    price: parseFloat(price),
    description: description || ''
  };
  
  // Update image if new one provided
  if (req.file) {
    products[productIndex].image = req.file.filename;
  }
  
  console.log('Updated product:', products[productIndex]);
  res.json({ success: true, product: products[productIndex] });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('DELETE /api/products/' + id + ' - Deleting product');
  console.log('Current products before delete:', products.map(p => ({ id: p.id, name: p.name })));
  
  const productIndex = products.findIndex(p => p.id === id);
  console.log('Product index found:', productIndex);
  
  if (productIndex === -1) {
    console.log('Product not found');
    return res.json({ success: false, error: 'Product not found' });
  }
  
  // Remove product from array
  const deletedProduct = products.splice(productIndex, 1)[0];
  console.log('Deleted product:', deletedProduct);
  console.log('Remaining products after delete:', products.length);
  
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Campaign endpoints
app.get('/api/campaigns', (req, res) => {
  console.log('GET /api/campaigns - Returning', campaigns.length, 'campaigns');
  res.json(campaigns);
});

app.post('/api/campaigns', upload.single('image'), (req, res) => {
  console.log('POST /api/campaigns - Creating new campaign');
  
  if (!req.file) {
    return res.json({ success: false, error: 'Image required' });
  }
  
  const { caption, description } = req.body;
  if (!caption) {
    return res.json({ success: false, error: 'Caption required' });
  }
  
  const newId = Math.max(...campaigns.map(c => c.id)) + 1;
  const campaign = {
    id: newId,
    image: `http://localhost:3000/uploads/${req.file.filename}`,
    caption,
    description: description || ''
  };
  
  campaigns.push(campaign);
  console.log('Created campaign:', campaign);
  
  res.json({ success: true, campaign });
});

app.put('/api/campaigns/:id', upload.single('image'), (req, res) => {
  const id = parseInt(req.params.id);
  console.log('PUT /api/campaigns/' + id + ' - Updating campaign');
  
  const campaignIndex = campaigns.findIndex(c => c.id === id);
  if (campaignIndex === -1) {
    return res.json({ success: false, error: 'Campaign not found' });
  }
  
  const { caption, description } = req.body;
  if (!caption) {
    return res.json({ success: false, error: 'Caption required' });
  }
  
  // Update campaign
  campaigns[campaignIndex] = {
    ...campaigns[campaignIndex],
    caption,
    description: description || ''
  };
  
  // Update image if new one provided
  if (req.file) {
    campaigns[campaignIndex].image = `http://localhost:3000/uploads/${req.file.filename}`;
  }
  
  console.log('Updated campaign:', campaigns[campaignIndex]);
  res.json({ success: true, campaign: campaigns[campaignIndex] });
});

app.delete('/api/campaigns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log('DELETE /api/campaigns/' + id + ' - Deleting campaign');
  
  const campaignIndex = campaigns.findIndex(c => c.id === id);
  if (campaignIndex === -1) {
    return res.json({ success: false, error: 'Campaign not found' });
  }
  
  const deletedCampaign = campaigns.splice(campaignIndex, 1)[0];
  console.log('Deleted campaign:', deletedCampaign);
  
  res.json({ success: true, message: 'Campaign deleted successfully' });
});

// Place an order
app.post('/api/orders', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const user = await User.findOne({ email: token });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid token' });
    const { products, totalAmount, paymentMethod, deliveryAddress, donation } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, error: 'No products in order' });
    }
    const order = await Order.create({
      user: user.email,
      products,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      donation: donation || 0,
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Order placement failed.' });
  }
});
// Get orders for current user
app.get('/api/orders', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  console.log('GET /api/orders called. Token:', token);
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, error: 'No token' });
  }
  try {
    const user = await User.findOne({ email: token });
    if (!user) {
      console.log('User not found for token:', token);
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
    const orders = await Order.find({ user: user.email }).sort({ createdAt: -1 });
    console.log('Orders found for user', user.email, ':', orders.length);
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error in /api/orders:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('GET /api/test - Test endpoint hit');
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    productCount: products.length,
    campaignCount: campaigns.length
  });
});

// Serve index.html at the root path
const fs = require('fs');
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 

// --- New Models ---
const paymentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user email
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  amount: Number,
  method: String,
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  receiptUrl: String,
});
const Payment = mongoose.model('Payment', paymentSchema);

const supportTicketSchema = new mongoose.Schema({
  user: { type: String, required: true },
  subject: String,
  message: String,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  responses: [{ message: String, date: Date, from: String }],
  createdAt: { type: Date, default: Date.now },
});
const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

const csrCertificateSchema = new mongoose.Schema({
  user: { type: String, required: true },
  title: String,
  url: String,
  date: { type: Date, default: Date.now },
});
const CSRCertificate = mongoose.model('CSRCertificate', csrCertificateSchema);

// --- User Schema Extensions ---
userSchema.add({
  wishlist: [{ type: Number }], // product IDs
  referralCode: { type: String, default: '' },
  referredBy: { type: String, default: '' },
  referrals: [{ type: String }], // emails
});

// --- Endpoints ---
// Payments
app.get('/api/payments', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const payments = await Payment.find({ user: token }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch payments.' });
  }
});
app.get('/api/payments/:id/receipt', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const payment = await Payment.findOne({ _id: req.params.id, user: token });
    if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });
    if (!payment.receiptUrl) return res.status(404).json({ success: false, error: 'No receipt available' });
    res.redirect(payment.receiptUrl);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch receipt.' });
  }
});
// Wishlist
app.get('/api/wishlist', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const user = await User.findOne({ email: token });
    res.json({ success: true, wishlist: user?.wishlist || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch wishlist.' });
  }
});
app.post('/api/wishlist', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { productId, action } = req.body;
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const user = await User.findOne({ email: token });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (action === 'add') {
      if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
    } else if (action === 'remove') {
      user.wishlist = user.wishlist.filter(id => id !== productId);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update wishlist.' });
  }
});
// Donations/Impact
app.get('/api/donations', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const orders = await Order.find({ user: token });
    const totalDonated = orders.reduce((sum, o) => sum + (o.donation || 0), 0);
    res.json({ success: true, totalDonated, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch donations.' });
  }
});
// Referrals
app.get('/api/referrals', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const user = await User.findOne({ email: token });
    res.json({ success: true, referralCode: user?.referralCode, referredBy: user?.referredBy, referrals: user?.referrals || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch referrals.' });
  }
});
app.post('/api/referrals/invite', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { email } = req.body;
  if (!token || !email) return res.status(400).json({ success: false, error: 'Missing data' });
  try {
    const user = await User.findOne({ email: token });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (!user.referralCode) user.referralCode = Math.random().toString(36).substring(2, 10);
    user.referrals.push(email);
    await user.save();
    res.json({ success: true, referralCode: user.referralCode, referrals: user.referrals });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to invite referral.' });
  }
});
// Support Tickets
app.get('/api/tickets', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const tickets = await SupportTicket.find({ user: token }).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch tickets.' });
  }
});
app.post('/api/tickets', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { subject, message } = req.body;
  if (!token || !subject || !message) return res.status(400).json({ success: false, error: 'Missing data' });
  try {
    const ticket = await SupportTicket.create({ user: token, subject, message, responses: [] });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create ticket.' });
  }
});
app.post('/api/tickets/:id/reply', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { message } = req.body;
  if (!token || !message) return res.status(400).json({ success: false, error: 'Missing data' });
  try {
    const ticket = await SupportTicket.findOne({ _id: req.params.id, user: token });
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    ticket.responses.push({ message, date: new Date(), from: token });
    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reply to ticket.' });
  }
});
// CSR Certificates
app.get('/api/certificates', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const certs = await CSRCertificate.find({ user: token }).sort({ date: -1 });
    res.json({ success: true, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch certificates.' });
  }
}); 

// Admin: Get all support tickets
app.get('/api/admin/tickets', authMiddleware, adminOnly, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch all tickets.' });
  }
}); 

// Middleware to verify JWT and attach user to req
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, error: 'No token' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}
// Middleware to check admin role
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
}

// Example: Protect an admin route
// app.get('/api/admin/tickets', authMiddleware, adminOnly, ...); 

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
}); 

// Ensure admin user exists on server start
async function ensureAdminUser() {
  const adminEmail = 'errixoriginals@gmail.com';
  const adminPassword = 'Comfortscomfort08';
  let admin = await User.findOne({ email: adminEmail });
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  if (!admin) {
    await User.create({
      fullName: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created:', adminEmail);
  } else {
    admin.role = 'admin';
    admin.password = hashedPassword;
    await admin.save();
    console.log('Admin user updated:', adminEmail);
  }
}

ensureAdminUser(); 

async function ensureTestUser() {
  const testEmail = 'test@gmail.com';
  const testPassword = 'TEST1234';
  let testUser = await User.findOne({ email: testEmail });
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(testPassword, 10);
  if (!testUser) {
    await User.create({
      fullName: 'Test User',
      email: testEmail,
      password: hashedPassword,
      role: 'user',
    });
    console.log('Test user created:', testEmail);
  } else {
    testUser.role = 'user';
    testUser.password = hashedPassword;
    await testUser.save();
    console.log('Test user updated:', testEmail);
  }
}

ensureTestUser(); 