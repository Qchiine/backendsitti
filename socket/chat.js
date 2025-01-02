const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function setupSocket(io) {
    // Middleware d'authentification pour Socket.IO
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.email);

        // Rejoindre une room personnelle pour recevoir des messages
        socket.join(socket.user._id.toString());

        // Écouter les nouveaux messages
        socket.on('sendMessage', async (data) => {
            try {
                const { receiverId, content } = data;

                // Vérifier si l'utilisateur a le droit d'envoyer un message au destinataire
                const sender = socket.user;
                const receiver = await User.findById(receiverId);

                if (!receiver) {
                    socket.emit('error', { message: 'Destinataire non trouvé' });
                    return;
                }

                // Vérifier la relation étudiant-encadrant
                const canSendMessage = 
                    (sender.role === 'etudiant' && receiver.role === 'encadrant' && sender.encadrant.equals(receiver._id)) ||
                    (sender.role === 'encadrant' && receiver.role === 'etudiant' && receiver.encadrant.equals(sender._id));

                if (!canSendMessage) {
                    socket.emit('error', { message: 'Vous n\'êtes pas autorisé à envoyer un message à cet utilisateur' });
                    return;
                }

                // Créer et sauvegarder le message
                const message = new Message({
                    sender: sender._id,
                    receiver: receiverId,
                    content
                });
                await message.save();

                // Envoyer le message au destinataire
                const populatedMessage = await Message.findById(message._id)
                    .populate('sender', 'nom prenom')
                    .populate('receiver', 'nom prenom');

                socket.emit('messageSent', populatedMessage);
                io.to(receiverId).emit('newMessage', populatedMessage);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
            }
        });

        // Gérer la déconnexion
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.user.email);
        });
    });
}

module.exports = setupSocket;
