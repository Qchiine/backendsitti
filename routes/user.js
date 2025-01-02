const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/mon-encadrant', 
    auth, 
    checkRole(['etudiant']), 
    userController.getEncadrantInfo
);

router.get('/mes-etudiants', 
    auth, 
    checkRole(['encadrant']), 
    userController.getEtudiantsEncadres
);

module.exports = router;
