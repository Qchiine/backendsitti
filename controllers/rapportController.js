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

        // Vérifier que l'encadrant est bien celui assigné à ce rapport
        if (!rapport.encadrant.equals(req.user._id)) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à corriger ce rapport' });
        }

        rapport.rapportCorrige = {
            filename: req.file.filename,
            path: req.file.path,
            uploadDate: new Date()
        };
        rapport.observations = req.body.observations;
        rapport.status = 'corrige';

        await rapport.save();

        // Notifier l'étudiant que son rapport a été corrigé
        res.json({
            message: 'Rapport corrigé avec succès',
            rapport: await rapport.populate('etudiant', 'nom prenom email')
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la soumission du rapport corrigé' });
    }
};

exports.getRapportsEtudiant = async (req, res) => {
    try {
        const rapports = await Rapport.find({ etudiant: req.user._id })
            .populate('encadrant', 'nom prenom email')
            .sort({ createdAt: -1 }); // Les plus récents d'abord

        res.json(rapports);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rapports' });
    }
};

exports.getRapportsEncadrant = async (req, res) => {
    try {
        const rapports = await Rapport.find({ encadrant: req.user._id })
            .populate('etudiant', 'nom prenom email')
            .sort({ createdAt: -1 }); // Les plus récents d'abord

        res.json(rapports);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rapports' });
    }
};

// Nouvelle fonction pour télécharger un rapport
exports.telechargerRapport = async (req, res) => {
    try {
        const rapport = await Rapport.findById(req.params.rapportId);
        
        if (!rapport) {
            return res.status(404).json({ message: 'Rapport non trouvé' });
        }

        // Vérifier que l'utilisateur a le droit d'accéder à ce rapport
        const isAuthorized = 
            rapport.etudiant.equals(req.user._id) || 
            rapport.encadrant.equals(req.user._id);

        if (!isAuthorized) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Déterminer quel fichier envoyer (original ou corrigé)
        const type = req.query.type || 'original';
        const fichier = type === 'corrige' ? rapport.rapportCorrige : rapport.originalRapport;

        if (!fichier || !fichier.path) {
            return res.status(404).json({ 
                message: type === 'corrige' ? 
                    'Le rapport corrigé n\'est pas encore disponible' : 
                    'Le rapport original n\'est pas disponible'
            });
        }

        res.download(fichier.path, fichier.filename);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du téléchargement du rapport' });
    }
};
