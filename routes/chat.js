const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

// Obtenir la liste des conversations
router.get('/conversations', auth, chatController.getConversations);

// Obtenir l'historique des messages avec un utilisateur spécifique
router.get('/messages/:userId', auth, chatController.getMessages);

// Marquer les messages comme lus
router.put('/messages/:userId/read', auth, chatController.markAsRead);

module.exports = router;
