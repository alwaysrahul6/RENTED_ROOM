const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomlelo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Room Schema
const roomSchema = new mongoose.Schema({
    title: String,
    location: String,
    price: Number,
    type: String,
    description: String,
    images: [String],
    amenities: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'pending'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Room = mongoose.model('Room', roomSchema);

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    phone: String,
    role: {
        type: String,
        enum: ['owner', 'student'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Contact Message Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
// Home page - Get featured rooms
app.get('/api/featured-rooms', async (req, res) => {
    try {
        const rooms = await Room.find({ status: 'available' })
            .sort({ createdAt: -1 })
            .limit(6)
            .populate('owner', 'name email phone');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search rooms
app.get('/api/search-rooms', async (req, res) => {
    try {
        const { location, minPrice, maxPrice, type } = req.query;
        let query = { status: 'available' };

        if (location) query.location = new RegExp(location, 'i');
        if (type) query.type = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const rooms = await Room.find(query).populate('owner', 'name email phone');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const contact = new Contact({ name, email, subject, message });
        await contact.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Room posting with image upload
app.post('/api/rooms', upload.array('images'), async (req, res) => {
    try {
        const roomData = JSON.parse(req.body.roomData);
        const imagePaths = req.files ? req.files.map(file => '/uploads/' + file.filename) : [];
        
        const room = new Room({
            ...roomData,
            images: imagePaths,
            owner: req.body.ownerId // You'll need to pass the owner's ID from the frontend
        });
        
        const savedRoom = await room.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all rooms with filters
app.get('/api/rooms', async (req, res) => {
    try {
        const { type, location, minPrice, maxPrice } = req.query;
        let query = { status: 'available' };

        if (type) query.type = type;
        if (location) query.location = new RegExp(location, 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const rooms = await Room.find(query).populate('owner', 'name email phone');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        const user = new User({ name, email, password, phone, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// User login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/rent', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rent.html'));
});

app.get('/rooms', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rooms.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/add-room', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-room.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 