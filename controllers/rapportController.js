const Rapport = require('../models/Rapport');
const User = require('../models/User');

exports.soumettreRapport = async (req, res) => {
    try {
        const rapport = new Rapport({
            etudiant: req.user._id,
            encadrant: req.user.encadrant,
            originalRapport: {
                filename: req.file.filename,
                path: req.file.path,
                uploadDate: new Date()
            }
        });

        await rapport.save();
        res.status(201).json(rapport);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la soumission du rapport' });
    }
};

exports.soumettreRapportCorrige = async (req, res) => {
    try {
        const rapport = await Rapport.findById(req.params.rapportId);
        
        if (!rapport) {
            return res.status(404).json({ message: 'Rapport non trouvé' });
        }

        rapport.rapportCorrige = {
            filename: req.file.filename,
            path: req.file.path,
            uploadDate: new Date()
        };
        rapport.observations = req.body.observations;
        rapport.status = 'corrige';

        await rapport.save();
        res.json(rapport);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la soumission du rapport corrigé' });
    }
};

exports.getRapportsEtudiant = async (req, res) => {
    try {
        const rapports = await Rapport.find({ etudiant: req.user._id })
            .populate('encadrant', 'nom prenom email');
        res.json(rapports);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rapports' });
    }
};

exports.getRapportsEncadrant = async (req, res) => {
    try {
        const rapports = await Rapport.find({ encadrant: req.user._id })
            .populate('etudiant', 'nom prenom email');
        res.json(rapports);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rapports' });
    }
};
