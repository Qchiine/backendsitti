const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables
dotenv.config();

// Vérification des variables d'environnement
console.log('Vérification des variables d\'environnement:');
console.log('PORT:', process.env.PORT || 5000);
console.log('MONGODB_URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-stages');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

// Import des routes
const authRoutes = require('./routes/auth');
const rapportRoutes = require('./routes/rapport');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const etudiantRoutes = require('./routes/etudiant');
const internshipRoutes = require('./routes/internship');

const app = express();
const server = http.createServer(app);

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Configuration CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier pour les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion-stages', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// Setup Socket.IO
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const setupSocket = require('./socket/chat');
setupSocket(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rapports', rapportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/stages', internshipRoutes);

// Route de test
app.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Route de base
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API de gestion des stages' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Erreur:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Une erreur est survenue sur le serveur',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`📡 URL du serveur: http://localhost:${PORT}`);
});
