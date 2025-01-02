const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedData = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Suppression des données existantes
        await User.deleteMany({});

        // Création des encadrants
        const encadrants = await User.create([
            {
                email: 'hajarsitti@example.com',
                password: 'hajar123',
                nom: 'sitti',
                prenom: 'hajar',
                role: 'encadrant'
            },
            {
                email: 'mrs sefsoufe@example.com',
                password: 'sefsoufe123',
                nom: 'mrs',
                prenom: 'sefsoufe',
                role: 'encadrant'
            }
        ]);

        // Création des étudiants
        const etudiants = await User.create([
            {
                email: 'chaima@example.com',
                password: 'chaima123',
                nom: 'qchiine',
                prenom: 'chaima',
                role: 'etudiant',
                encadrant: encadrants[0]._id
            },
            {
                email: 'yaya@example.com',
                password: 'yaya123',
                nom: 'yaya',
                prenom: 'aithalibi',
                role: 'etudiant',
                encadrant: encadrants[0]._id
            },
            {
                email: 'sara@example.com',
                password: 'sara123',
                nom: 'sara',
                prenom: 'madaouani',
                role: 'etudiant',
                encadrant: encadrants[1]._id
            },
            {
                email: 'aroua@example.com',
                password: 'aroua123',
                nom: 'aroua',
                prenom: 'qchiine',
                role: 'etudiant',
                encadrant: encadrants[1]._id
            },
            {
                email: 'rawane@example.com',
                password: 'rawane123',
                nom: 'El boumeshouli',
                prenom: 'rawane',
                role: 'etudiant',
                encadrant: encadrants[1]._id
            }
        ]);

        console.log('Données de test créées avec succès');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de la création des données de test:', error);
        process.exit(1);
    }
};

seedData();
