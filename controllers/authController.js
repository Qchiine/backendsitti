const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.login = async (req, res) => {
    try {
        console.log('👉 Tentative de connexion avec:', {
            email: req.body.email,
            passwordLength: req.body.password ? req.body.password.length : 0
        });

        const { email, password } = req.body;

        if (!email || !password) {
            console.log('❌ Email ou mot de passe manquant');
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        const user = await User.findOne({ email });
        console.log('👤 Utilisateur trouvé:', user ? {
            id: user._id,
            email: user.email,
            role: user.role,
            hasPassword: !!user.password
        } : 'Non');

        if (!user) {
            console.log('❌ Utilisateur non trouvé');
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await user.comparePassword(password);
        console.log('🔑 Mot de passe correct:', isMatch ? 'Oui' : 'Non');

        if (!isMatch) {
            console.log('❌ Mot de passe incorrect');
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = generateToken(user._id);
        console.log('✅ Connexion réussie, token généré');

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};
