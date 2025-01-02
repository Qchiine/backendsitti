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
        console.log('Tentative de connexion avec:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        const user = await User.findOne({ email });
        console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const isMatch = await user.comparePassword(password);
        console.log('Mot de passe correct:', isMatch ? 'Oui' : 'Non');

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = generateToken(user._id);
        
        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role,
                encadrant: user.encadrant
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: error.message 
        });
    }
};
