const Message = require('../models/Message');
const User = require('../models/User');

// Obtenir l'historique des messages entre deux utilisateurs
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user._id }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('sender', 'nom prenom')
        .populate('receiver', 'nom prenom');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des messages' });
    }
};

// Marquer les messages comme lus
exports.markAsRead = async (req, res) => {
    try {
        await Message.updateMany(
            { 
                sender: req.params.userId,
                receiver: req.user._id,
                read: false
            },
            { read: true }
        );
        res.json({ message: 'Messages marqués comme lus' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour des messages' });
    }
};

// Obtenir la liste des conversations
exports.getConversations = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        let contacts;

        if (user.role === 'etudiant') {
            // Un étudiant ne peut voir que son encadrant
            contacts = await User.find({ _id: user.encadrant });
        } else if (user.role === 'encadrant') {
            // Un encadrant peut voir tous ses étudiants
            contacts = await User.find({ encadrant: user._id });
        }

        // Obtenir le dernier message et le nombre de messages non lus pour chaque contact
        const conversations = await Promise.all(contacts.map(async (contact) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { sender: req.user._id, receiver: contact._id },
                    { sender: contact._id, receiver: req.user._id }
                ]
            })
            .sort({ createdAt: -1 });

            const unreadCount = await Message.countDocuments({
                sender: contact._id,
                receiver: req.user._id,
                read: false
            });

            return {
                contact: {
                    _id: contact._id,
                    nom: contact.nom,
                    prenom: contact.prenom,
                    role: contact.role
                },
                lastMessage,
                unreadCount
            };
        }));

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des conversations' });
    }
};
