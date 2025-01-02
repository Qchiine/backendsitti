const mongoose = require('mongoose');
const User = require('../models/User');
const Etudiant = require('../models/Etudiant');
require('dotenv').config();

const seedData = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Suppression des données existantes
        await User.deleteMany({});
        await Etudiant.deleteMany({});

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
                email: 'mrs.sefsoufe@example.com',
                password: 'sefsoufe123',
                nom: 'mrs',
                prenom: 'sefsoufe',
                role: 'encadrant'
            }
        ]);

        // Création des étudiants de test
        const etudiants = await Etudiant.create([
            {
                nom: 'Qchiine',
                prenom: 'Chaima',
                filiere: 'Génie Informatique',
                niveau: '4ème année',
                email: 'chaima@example.com',
                encadrant: encadrants[0]._id
            },
            {
                nom: 'Aithalibi',
                prenom: 'Yaya',
                filiere: 'Génie Civil',
                niveau: '3ème année',
                email: 'yaya@example.com',
                encadrant: encadrants[0]._id
            },
            {
                nom: 'El Amrani',
                prenom: 'Sara',
                filiere: 'Génie Industriel',
                niveau: '5ème année',
                email: 'sara@example.com',
                encadrant: encadrants[1]._id
            },
            {
                nom: 'Bennani',
                prenom: 'Ahmed',
                filiere: 'Génie Mécanique',
                niveau: '2ème année',
                email: 'ahmed@example.com',
                encadrant: encadrants[1]._id
            }
        ]);

        console.log('Données de test créées avec succès');
        console.log('Encadrants:', encadrants);
        console.log('Étudiants:', etudiants);

        await mongoose.connection.close();
        console.log('Déconnecté de MongoDB');
    } catch (error) {
        console.error('Erreur lors du seeding:', error);
        process.exit(1);
    }
};

seedData();
