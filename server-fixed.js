const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

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

app.get('/', (req, res) => {
  res.send('Errix Originals API is running! Try /api/products or /api/campaigns');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/products - Get all products');
  console.log('  POST /api/products - Create new product');
  console.log('  PUT  /api/products/:id - Update product');
  console.log('  DELETE /api/products/:id - Delete product');
  console.log('  GET  /api/test - Test endpoint');
}); 