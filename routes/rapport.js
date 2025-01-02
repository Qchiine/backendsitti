const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth, checkRole } = require('../middleware/auth');
const rapportController = require('../controllers/rapportController');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/rapports/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accepter seulement les fichiers PDF
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers PDF sont acceptés'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // Limite de 10MB
    }
});

// Routes pour les étudiants
router.post('/soumettre', 
    auth, 
    checkRole(['etudiant']), 
    upload.single('rapport'), 
    rapportController.soumettreRapport
);

router.get('/mes-rapports', 
    auth, 
    checkRole(['etudiant']), 
    rapportController.getRapportsEtudiant
);

// Routes pour les encadrants
router.post('/:rapportId/corriger', 
    auth, 
    checkRole(['encadrant']), 
    upload.single('rapportCorrige'), 
    rapportController.soumettreRapportCorrige
);

router.get('/a-corriger', 
    auth, 
    checkRole(['encadrant']), 
    rapportController.getRapportsEncadrant
);

// Route pour télécharger un rapport (accessible aux étudiants et encadrants)
router.get('/:rapportId/telecharger', 
    auth, 
    checkRole(['etudiant', 'encadrant']), 
    rapportController.telechargerRapport
);

module.exports = router;
