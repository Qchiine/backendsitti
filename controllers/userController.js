const User = require('../models/User');

exports.getEncadrantInfo = async (req, res) => {
    try {
        const etudiant = await User.findById(req.user._id).populate('encadrant', 'nom prenom email');
        if (!etudiant || !etudiant.encadrant) {
            return res.status(404).json({ message: 'Encadrant non trouvé' });
        }
        res.json(etudiant.encadrant);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des informations de l\'encadrant' });
    }
};

exports.getEtudiantsEncadres = async (req, res) => {
    try {
        const etudiants = await User.find({ 
            encadrant: req.user._id,
            role: 'etudiant'
        }, 'nom prenom email');
        res.json(etudiants);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des étudiants' });
    }
};
