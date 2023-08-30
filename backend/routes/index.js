var express = require('express');
var router = express.Router();
var passport = require('passport');
const User = require('./users');
const {Category, Subcategory }  = require("./Categoriescreate");
const Worker  = require("./worker");
const Post  = require("./Post");
const cors = require('cors'); 
const Contact = require('./CustomerData');
const Shop = require('./shopkeeper');
const Product = require('./shopProduct');
const Food = require('./food');
const FoodProduct = require('./foodProduct.js');
const Review = require('./review');
const Seller = require('./Seller');
const OldItem = require('./OldItem')
const Message = require('./messagemodal');

const multer = require("multer")
const mongoose = require('mongoose');
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));
const jwt = require('jsonwebtoken');


const corsOptions = {
  origin: 'http://vnear.in', // Replace with your frontend's domain
  methods: 'GET,PUT,POST,DELETE',
  optionsSuccessStatus: 204,
};

router.use(cors(corsOptions));
/* GET home page. */
const secretKey = 'hjfjhgvsdhjbjjeghj'; 
router.get('/noone', function(req, res) {
  res.render("index")
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  const newUser = new User({ username, email });

  User.register(newUser, password, (error, user) => {
    if (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ message: 'An error occurred' });
    }

    // If the user is successfully registered, generate a JWT token
    const payload = { userId: user._id, email: user.email };
    const secretKey = "hjfjhgvsdhjbjjeghj"; // Replace this with your actual secret key
    const options = { expiresIn: '1h' }; // Set the token expiration time

    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) {
        console.error('Error creating JWT token:', err);
        return res.status(500).json({ message: 'An error occurred' });
      }

      // Send the JWT token in the response
      res.status(200).json({ token: token });
    });
  });
});

router.post('/login', async (req, res) => {
  const { email,username, password } = req.body;

  try {

    const userByEmail = await User.findOne({ email: email });

    // Check if the worker exists in the database (based on username)
    const workerByUsername = await Worker.findOne({ username: username });

    let user;
    let isWorker = false;

    // Determine if the provided login credentials belong to a worker or a user
    if (userByEmail) {
      user = userByEmail;
    } else if (workerByUsername) {
      user = workerByUsername;
      isWorker = true;
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Use the "authenticate" method to verify the user's password
    const isAuthenticated = await user.authenticate(password);

    if (!isAuthenticated) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user._id, email: user.email, isWorker };
    const options = { expiresIn: '1h' }; // Set the token expiration time

    const token = jwt.sign(payload, secretKey, options);

    res.status(200).json({ token });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const fileFilter = function (req, file, cb) {
  if (file && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false); // Do not throw an error for non-image files
  }
};

const upload = multer({ storage, fileFilter });

// Create a category
const { v4: uuidv4 } = require('uuid');
const { route } = require('../app');
const { Router } = require('express');

// Function to generate a unique ID for the category
const generateUniqueId = () => {
  return uuidv4(); // Using UUID v4 for generating unique IDs
};


router.post('/categories', upload.single('image'), async (req, res) => {
  const { name } = req.body;

  try {
    const category = new Category({
      name: name,
      image: req.file.filename, // Assuming the field name for the image is 'image'
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Create a sub-category

router.post('/categories/:categoryId/subcategories', upload.single('image'), (req, res) => {
  const categoryId = req.params.categoryId;
  const { name } = req.body;

  const subcategory = new Subcategory({
    name: name,
    category: categoryId,
    image: req.file.filename, // Assuming the field name for the image is 'image'
  });

  subcategory
    .save()
    .then((result) => {
      return Category.findByIdAndUpdate(
        categoryId,
        { $push: { subcategories: result._id } },
        { new: true }
      );
    })
    .then((category) => {
      res.status(201).json(category);
    })
    .catch((err) => {
      console.error('Error creating sub-category:', err);
      res.status(500).json({ error: 'Failed to create sub-category' });
    });
});

router.get('/category', (req, res) => {
  Category.find()
  
    .then((categories) => {
      console.log('Request URL:', req.url);

      res.json(categories);
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    });
});


// GET route to fetch subcategories for a specific category
router.get('/category/:categoryId/subcategories', async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findById(categoryId).populate('subcategories');
    
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(200).json(category.subcategories);
    }
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

router.get('/subcategory/:subcategoryId/workers', (req, res) => {
  const subcategoryId = req.params.subcategoryId; // Corrected variable name

  Worker.find({ id: subcategoryId })
    .then((workers) => {
      if (workers.length === 0) {
        // No workers found with the given subcategoryId
        res.status(404).json({ error: 'No workers found for the subcategory ID' });
      } else {
        // Workers found, send the response with the workers array
        res.status(200).json(workers);
      }
    })
    .catch((err) => {
      console.error('Error fetching workers:', err);
      res.status(500).json({ error: 'Failed to fetch workers' });
    });
});


// GET route to fetch category details by ID
router.get('/category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;

  Category.findById(categoryId)
    .populate('subcategories') // If you want to populate the subcategories data as well
    .then((category) => {
      res.status(200).json(category);
    })
    .catch((err) => {
      console.error('Error fetching category details:', err);
      res.status(500).json({ error: 'Failed to fetch category details' });
    });
});

router.post('/workerregister', (req, res) => {
  const { username, location, password, name, number, categories, subcategories, workDescription } = req.body;
  const subcategoryId = req.body.subcategory;

  const newWorker = new Worker({
    username,
    name,
    number,
    location,
    categories,
    subcategories,
    subcategory: subcategoryId,
    workDescription
  });

  Worker.register(newWorker, password, (err, worker) => {
    if (err) {
      console.error('Failed to register worker:', err);
      return res.status(500).json({ error: 'Failed to register worker' });
    }

    // Create a JWT token and sign the worker's information
    const token = jwt.sign({ workerId: worker._id }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Worker registration successful!', token });
  });
});

router.get('/workerregister', (req, res) => {
  Worker.find()
    .then((workers) => {
      res.status(200).json(workers);
    })
    .catch((err) => {
      console.error('Error fetching workers:', err);
      res.status(500).json({ error: 'Failed to fetch workers' });
    });
});


router.get('/getUserRole', passport.authenticate('local', { session: false }), (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
      } else {
        const role = user.role;
        res.status(200).json({ success: true, role: role });
      }
    })
    .catch(error => {
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

// GET route to fetch pending worker registration requests
router.get('/workerregister/requests', (req, res) => {
  Worker.find({ approvalStatus: 'pending' })
    .then((requests) => {
      res.status(200).json(requests);
    })
    .catch((err) => {
      console.error('Error fetching worker registration requests:', err);
      res.status(500).json({ error: 'Failed to fetch worker registration requests' });
    });
});


// PATCH route to approve or reject worker registration requests
router.patch('/workerregister/requests/:id', (req, res) => {
  const { id } = req.params;
  const { approvalStatus } = req.body;

  Worker.findByIdAndUpdate(id, { approvalStatus }, { new: true })
    .then((worker) => {
      if (!worker) {
        return res.status(404).json({ error: 'Worker registration request not found' });
      }
      if (approvalStatus === 'approved') {
        res.json({ message: 'Worker registration request approved' });
      } else if (approvalStatus === 'rejected') {
        Worker.findByIdAndRemove(id)
          .then(() => {
            res.json({ message: 'Worker registration request rejected and removed' });
          })
          .catch((err) => {
            console.error('Error removing worker registration request:', err);
            res.status(500).json({ error: 'Failed to remove worker registration request' });
          });
      } else {
        res.status(400).json({ error: 'Invalid approval status' });
      }
    })
    .catch((err) => {
      console.error('Error updating worker registration request:', err);
      res.status(500).json({ error: 'Failed to update worker registration request' });
    });
});

router.get('/api/worker/:id', (req, res) => {
req.params._id; // Replace with the specific worker ID you want to fetch

  // Assuming you have a Worker model or data access layer to retrieve the worker data
  Worker.findById(req.params.id) // Use the workerId variable instead of req.params.id
    .then((worker) => {
      if (!worker) {
        return res.status(404).json({ message: 'Worker not found' });
      }
      res.json(worker);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});




router.get('/api/worker/:workerId/rating', async (req, res) => {
  try {
    const { workerId } = req.params;

    // Assuming you are using MongoDB and have a Worker model defined
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const { reviews } = worker;
    if (reviews.length === 0) {
      return res.json({ averageRating: 0 }); // Return 0 if no reviews found
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.json({ averageRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate average rating' });
  }
});

const bcrypt = require('bcrypt');
const Shopkeeper = require('./shopkeeper');


router.post('/shop-register', async (req, res) => {
  const { username, location, phoneNumber, password } = req.body;

  try {
    const existingShopkeeper = await Shopkeeper.findOne({ phoneNumber });
    if (existingShopkeeper) {
      return res.status(409).json({ message: 'Phone number is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newShopkeeper = new Shopkeeper({
      username,
      location,
      phoneNumber,
      password: hashedPassword,
    });

    await newShopkeeper.save();

    // Generate a JWT token with the shopkeeper's ID and other relevant data.
    const token = jwt.sign({ userId: newShopkeeper._id }, secretKey, { expiresIn: '122222222222225646465454654644h' });

    // Respond with the token.
    res.json({ message: 'Shopkeeper registered successfully.', token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'An error occurred during registration.' });
  }
});

router.get('/shop/:shopId/products', async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log('Received request for shopId:', shopId);
    const products = await Product.find({ shop: shopId });
    console.log('Retrieved products:', products);

    res.json({ products });
  } catch (error) {
    console.error('Error getting products for shop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/api/shop/:shopId', async (req, res) => {
  try {
    // Assuming you have a database model named Shop that stores shop data
    // You should replace this with your actual database query to fetch shop data
    const shopId = req.params.shopId;
    const shopData = await Shop.findOne({ _id: shopId });

    // If shopData is not found in the database, return a 404 response
    if (!shopData) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Respond with the shop data
    res.json(shopData);
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/food-register', async (req, res) => {
  const { username, location, cuisine, phoneNumber, password } = req.body;

  try {
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    const existingFood = await Food.findOne({ phoneNumber });
    if (existingFood) {
      return res.status(409).json({ message: 'Phone number is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newFood = new Food({
      username,
      cuisine,
      location,
      phoneNumber,
      password: hashedPassword,
    });

    await newFood.save();

    // Generate JWT token
    const token = jwt.sign({  foodId: newFood._id }, secretKey, { expiresIn: '122222222222225646465454654644h' });

    res.json({ message: 'Food registered successfully.', token });
  } catch (err) {
    console.error('Error during food registration:', err);
    res.status(500).json({ message: 'An error occurred during food registration.', error: err.message });
  }
});

router.post('/food-login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const food = await Food.findOne({ phoneNumber });

    if (!food) {
      return res.status(404).json({ message: 'Food shop not found.' });
    }

    // Check if the provided password matches the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, food.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ foodId: food._id  }, secretKey, { expiresIn: '1h' });
     console.log(food._id)
    res.json({ message: 'Login successful.', token,foodId: food._id  });
  } catch (err) {
    console.error('Error during food login:', err);
    res.status(500).json({ message: 'An error occurred during food login.', error: err.message });
  }
});

// Assuming you have already imported the necessary dependencies and set up the required middleware

// Define a route for seller registration
router.post('/seller-register', async (req, res) => {
  const { username, location, phoneNumber, password } = req.body;

  try {
    // Check if the seller with the given phone number already exists
    const existingSeller = await Seller.findOne({ phoneNumber });
    if (existingSeller) {
      return res.status(409).json({ message: 'Phone number is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new seller instance
    const newSeller = new Seller({
      username,
      location,
      phoneNumber,
      password: hashedPassword,
    });

    // Save the seller to the database
    await newSeller.save();

    const token = jwt.sign({ sellerId: newSeller._id }, secretKey, { expiresIn: '122222222222225646465454654644h' });

    res.json({ message: 'Seller registered successfully.', token });
  } catch (error) {
    console.error('Error during seller registration:', error);
    res.status(500).json({ message: 'An error occurred during seller registration.' });
  }
});

router.post('/seller-login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Check if the seller with the given phone number exists
    const newSeller = await Seller.findOne({ phoneNumber });

    if (!newSeller) {
      return res.status(404).json({ message: 'Seller not found.' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, newSeller.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ sellerId: newSeller._id }, secretKey, { expiresIn: '1h' });
 console.log( newSeller._id )
    res.json({ message: 'Login successful.', token,sellerId: newSeller._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});


const jwtDecode = require('jwt-decode');


router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, quantity, description, category } = req.body;
    const token = req.headers.authorization; // Assuming shopId is stored in the authorization header

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const decodedToken = jwt.verify(token, secretKey);
    const shopId = decodedToken.userId;
 console.log(decodedToken)
    if (!shopId) {
      return res.status(400).json({ message: 'Bad request: Missing shopId in token' });
    }

    console.log('shopId:', shopId);

    const shop = await Shopkeeper.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const shopOwnerNumber = shop.phoneNumber;

    const newProduct = new Product({
      name,
      price,
      quantity,
      description,
      shop: shop._id,
      category,
      phoneNumber: shopOwnerNumber, 
    });

    if (req.file) {
      // Only save the image path if a file was uploaded
      newProduct.image = req.file.filename;
    }

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
  
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/api/user', async (req, res) => {
  try {
    const products = await User.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Assuming you have defined the required modules and the 'Product' model properly.
router.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id; // Extract the ID from the request parameters

    // Check if the productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Use Mongoose's findById method to find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      // If no product is found with the given ID, return a 404 response
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product is found, return it as a JSON response
    res.json(product);
  } catch (error) {
    // If there's an error during the process, handle it and return a 500 response
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/foodproduct', upload.single('image'), async (req, res) => {
  try {
    const { name, price, quantity, description, category } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    // Assuming foodId is stored in the token and was signed with a secret key
    const decodedToken = jwt.verify(token, secretKey);
    const foodId = decodedToken.foodId;
    console.log('foodId:', foodId);

    // Retrieve the food shop based on the foodId
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const shopOwnerNumber = food.phoneNumber;
 console.log(shopOwnerNumber)
    const newProduct = new FoodProduct({
      name,
      price,
      quantity,
      description,
      shop: food._id,
      category,
      phoneNumber: shopOwnerNumber, 
    });
    console.log(newProduct)
    if (req.file) {
      // Only save the image path if a file was uploaded
      newProduct.image = req.file.filename;
    }

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/api/foodproducts', async (req, res) => {

  try {
    const products = await FoodProduct.find()
    res.json( products );
  } catch (error) {
    console.error('Error fetching food products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/api/olditem', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, condition } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    // Assuming sellerId is stored in the token and was signed with a secret key
    const decodedToken = jwt.verify(token, secretKey);
    const sellerId = decodedToken.sellerId;
    console.log('sellerId:', sellerId);

    // Retrieve the seller based on the sellerId
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const newItem = new OldItem({
      name,
      price,
      description,
      condition,
      category,
      shop: seller._id,
    });

    if (req.file) {
      // Only save the image path if a file was uploaded
      newItem.image = req.file.filename;
    }

    await newItem.save();

    res.status(201).json({ message: 'Old item created successfully', item: newItem });
  } catch (error) {
    console.error('Error creating old item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/sellerproducts/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await OldItem.find({ shop: sellerId });
    console.log(products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/api/products-for-sell', async (req, res) => {
  try {
    const products = await OldItem.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/api/products-for-sell/:id', async (req, res) => {
  try {
    const productId = req.params.id; // Extract the ID from the request parameters

    // Check if the productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Use Mongoose's findById method to find the product by its ID
    const product = await OldItem.findById(productId);

    if (!product) {
      // If no product is found with the given ID, return a 404 response
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product is found, return it as a JSON response
    res.json(product);
  } catch (error) {
    // If there's an error during the process, handle it and return a 500 response
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/contact', (req, res) => {
  const { name, number, location } = req.body;
  if (!name || !number || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const contactData = new Contact({
    name,
    number,
    location,
  });

  // Save the contact data to the database
  contactData
    .save()
    .then((savedContact) => {
      console.log('Data saved successfully:', savedContact);
      return res.status(200).json({ message: 'Data saved successfully.', contact: savedContact });
    })
    .catch((error) => {
      console.error('Error saving data to the database:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    });
});


router.post('/shoplogin', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const shopkeeper = await Shopkeeper.findOne({ phoneNumber });
    if (!shopkeeper) {
      return res.status(401).json({ message: 'Invalid phone number or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, shopkeeper.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid phone number or password.' });
    }

    const token = jwt.sign({ userId: shopkeeper._id }, secretKey, { expiresIn: '144h' });

    res.json({ message: 'Login successful.', token, userId: shopkeeper._id });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});



router.put('/update-shop/:id/username', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
    const shopkeeper = await Shopkeeper.findById(id);
    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found.' });
    }

    shopkeeper.username = username;
    await shopkeeper.save();

    res.json({ message: 'Shopkeeper username updated successfully.', shopkeeper });
  } catch (error) {
    console.error('Error updating shopkeeper username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/api/foodproducts/:id', async (req, res) => {
  try {
    const productId = req.params.id; // Extract the ID from the request parameters

    // Check if the productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Use Mongoose's findById method to find the product by its ID
    const product = await FoodProduct.findById(productId);
    

    if (!product) {
      // If no product is found with the given ID, return a 404 response
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product is found, return it as a JSON response
    res.json(product);
  } catch (error) {
    // If there's an error during the process, handle it and return a 500 response
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/api/messages', (req, res) => {
  const { type, text } = req.body;

  const message = new Message({
    type,
    text,
  });

  message
    .save()
    .then(() => {
      res.status(200).json({ success: true, message: 'Message saved successfully' });
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: 'Error saving message' });
    });
});


router.get('/api/products', async (req, res) => {
  try {
    const { query } = req.query;
    
    // Here we are using a simple regex to perform case-insensitive search on the 'name' field of the products
    // You can customize this query to fit your data model and requirements
    const products = await Product.find({ name: { $regex: new RegExp(query, 'i') } });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/api/foodproducts/:id/reviews', async (req, res) => {
  try {
    const { author, comment, rating } = req.body;

    // Check if the food product with the given id exists
    const foodProduct = await FoodProduct.findById(req.params.id);
    if (!foodProduct) {
      return res.status(404).json({ message: 'Food product not found' });
    }

    // Create a new Review instance using the model
    const newReview = new Review({
      author,
      comment,
      rating,
      foodProduct: req.params.id,
    });

    // Save the review to the database
    const review = await newReview.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/foodproducts/:id/reviews', async (req, res) => {
  try {
    // Check if the food product with the given id exists
    const foodProduct = await FoodProduct.findById(req.params.id);
    if (!foodProduct) {
      return res.status(404).json({ message: 'Food product not found' });
    }

    // Fetch all reviews associated with the food product
    const reviews = await Review.find({ foodProduct: req.params.id });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
