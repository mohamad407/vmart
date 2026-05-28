const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Kept multer so the server accepts the form data without crashing

const app = express();

// --- HARD-CODED CONFIGURATION ---
const MONGO_URI = "mongodb+srv://asif:Ummulhaina%4020@cluster0.atazdo9.mongodb.net/?appName=Cluster0";
const JWT_SECRET = "my_super_secret_vmart_key";

// Allows your specific Vercel frontend to connect
app.use(cors({ origin: 'https://vmart-pied.vercel.app', credentials: true }));
app.use(express.json());

// --- DATABASE MODELS ---
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: { type: String },
    phoneNumber: { type: String },
    role: { type: String, default: 'user' }
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    condition: { type: String, enum: ['New', 'Used'], required: true },
    usedDuration: { type: String },
    image: { type: String, required: true },
    billImage: { type: String },
    sellerPhone: { type: String },
    sellerWhatsapp: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

const MessageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    message: { type: String, required: true }
}, { timestamps: true });
const Message = mongoose.model('Message', MessageSchema);

// --- MIDDLEWARE ---
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized' });
        }
    }
    if (!token) return res.status(401).json({ message: 'No token' });
};

// --- MEMORY STORAGE (Replaces Cloudinary for now) ---
// This accepts image uploads so the server doesn't crash, but doesn't save them anywhere permanently
const upload = multer({ storage: multer.memoryStorage() });

// --- ROUTES ---

// 1. Auth Route
app.post('/api/auth/google', async (req, res) => {
    try {
        const { name, email, profileImage } = req.body;
        if (!email.endsWith('@vitstudent.ac.in')) return res.status(403).json({ message: 'Only VIT Students Allowed' });
        let user = await User.findOne({ email });
        if (!user) user = await User.create({ name, email, profileImage });
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. Create Product (Using dummy image URL since Cloudinary is not setup)
app.post('/api/products', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'billImage', maxCount: 1 }]), async (req, res) => {
    try {
        const { productName, category, price, quantity, description, condition, usedDuration, sellerPhone, sellerWhatsapp } = req.body;
        
        // DUMMY IMAGE PLACEHOLDER
        const image = "https://placehold.co/600x400/1a1a2e/00f2fe?text=VMart+Product";
        const billImage = "";
        
        const product = await Product.create({ productName, category, price: Number(price), quantity, description, condition, usedDuration, image, billImage, sellerPhone, sellerWhatsapp, sellerId: req.user._id });
        res.status(201).json(product);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. Get All Products
app.get('/api/products', async (req, res) => {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.productName = { $regex: search, $options: 'i' };
    const products = await Product.find(query).populate('sellerId', 'name email profileImage').sort({ createdAt: -1 });
    res.json(products);
});

// 4. Get Single Product
app.get('/api/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name email profileImage phoneNumber');
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
});

// 5. Send Message
app.post('/api/messages', protect, async (req, res) => {
    try {
        const { receiverId, productId, message } = req.body;
        const msg = await Message.create({ senderId: req.user._id, receiverId, productId, message });
        res.status(201).json(msg);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 6. Get Messages
app.get('/api/messages/:productId/:receiverId', protect, async (req, res) => {
    const messages = await Message.find({
        productId: req.params.productId,
        $or: [
            { senderId: req.user._id, receiverId: req.params.receiverId },
            { senderId: req.params.receiverId, receiverId: req.user._id }
        ]
    }).sort({ createdAt: 1 });
    res.json(messages);
});

// --- START SERVER ---
mongoose.connect(MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log(err));
