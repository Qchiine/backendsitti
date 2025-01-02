const express = require('express');
const router = express.Router();
const rapportController = require('../controllers/rapportController');
const { auth, checkRole } = require('../middleware/auth');
const upload = require('../config/upload');

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

module.exports = router;
