// Minimal Express backend for product uploads
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let products = [];

// Demo products to auto-populate if fewer than 6 exist
const demoProducts = [
  {
    name: 'Signature Sandal',
    price: 9380,
    description: 'Handmade sandal with premium materials.',
    image: 'https://via.placeholder.com/280?text=Signature+Sandal'
  },
  {
    name: 'Dignity Slide',
    price: 7500,
    description: 'Comfortable slide for everyday wear.',
    image: 'https://via.placeholder.com/280?text=Dignity+Slide'
  },
  {
    name: 'Classic Loafer',
    price: 12000,
    description: 'Classic loafer for formal occasions.',
    image: 'https://via.placeholder.com/280?text=Classic+Loafer'
  },
  {
    name: 'Urban Mule',
    price: 8500,
    description: 'Trendy mule for urban style.',
    image: 'https://via.placeholder.com/280?text=Urban+Mule'
  },
  {
    name: 'Heritage Boot',
    price: 15000,
    description: 'Durable boot with heritage design.',
    image: 'https://via.placeholder.com/280?text=Heritage+Boot'
  },
  {
    name: 'Minimalist Flip',
    price: 5000,
    description: 'Minimalist flip-flop for casual comfort.',
    image: 'https://via.placeholder.com/280?text=Minimalist+Flip'
  }
];

// On server start, auto-populate products if fewer than 6
function ensureDemoProducts() {
  if (products.length < 6) {
    products.length = 0; // Clear any existing
    demoProducts.forEach((p, i) => {
      products.push({
        id: i + 1,
        name: p.name,
        price: p.price,
        description: p.description,
        image: p.image // Use placeholder image URL
      });
    });
  }
}

ensureDemoProducts();

app.post('/api/products', upload.single('image'), (req, res) => {
  if (!req.file) return res.json({ success: false, error: 'Image required' });
  const { name, price, description } = req.body;
  if (!name || !price) return res.json({ success: false, error: 'Name and price required' });
  const product = {
    id: products.length + 1,
    name,
    price,
    description,
    image: req.file.filename
  };
  products.push(product);
  res.json({ success: true, product });
});

app.get('/api/products', (req, res) => {
  console.log('GET /api/products - Returning', products.length, 'products');
  res.json(products);
});

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Add PUT endpoint for updating products
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const id = parseInt(req.params.id);
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
  
  res.json({ success: true, product: products[productIndex] });
});

// Add DELETE endpoint for deleting products
app.delete('/api/products/:id', (req, res) => {
  console.log('DELETE request received for product ID:', req.params.id);
  
  const id = parseInt(req.params.id);
  console.log('Parsed ID:', id);
  console.log('Current products:', products.map(p => ({ id: p.id, name: p.name })));
  
  const productIndex = products.findIndex(p => p.id === id);
  console.log('Product index found:', productIndex);
  
  if (productIndex === -1) {
    console.log('Product not found');
    return res.json({ success: false, error: 'Product not found' });
  }
  
  // Remove product from array
  const deletedProduct = products.splice(productIndex, 1)[0];
  console.log('Deleted product:', deletedProduct);
  console.log('Remaining products:', products.length);
  
  res.json({ success: true, message: 'Product deleted successfully' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000')); 