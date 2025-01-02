const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');

// Routes pour les étudiants (sans authentification pour le moment)
router.get('/etudiants', etudiantController.getEtudiants);
router.post('/etudiants', etudiantController.createEtudiant);
router.put('/etudiants/:id', etudiantController.updateEtudiant);
router.delete('/etudiants/:id', etudiantController.deleteEtudiant);
router.get('/etudiants/:id', etudiantController.getEtudiantById);

module.exports = router;
