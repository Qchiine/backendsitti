const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables FIRST
dotenv.config();

// Verify environment variables
console.log('Vérification des variables d\'environnement:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

const connectDB = require('./config/db');
const setupSocket = require('./socket/chat');

// Import des routes
const authRoutes = require('./routes/auth');
const rapportRoutes = require('./routes/rapport');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

// Connexion à MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Setup Socket.IO
setupSocket(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier pour les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rapports', rapportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API de gestion des stages' });
});

// Set port and start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server URL: http://localhost:${PORT}`);
});
