const mongoose = require('mongoose');
const User = require('../models/User');
const Etudiant = require('../models/Etudiant');
const Internship = require('../models/Internship');
require('dotenv').config();

const seedData = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Suppression des données existantes
        await User.deleteMany({});
        await Etudiant.deleteMany({});
        await Internship.deleteMany({});

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

        // Créer un étudiant
        const student = await User.findOneAndUpdate(
            { email: 'etudiant@test.com' },
            {
                email: 'etudiant@test.com',
                password: '$2b$10$YourHashedPasswordHere',
                role: 'etudiant',
                nom: 'Nom Etudiant',
                prenom: 'Prenom Etudiant'
            },
            { upsert: true, new: true }
        );

        // Créer un superviseur
        const supervisor = await User.findOneAndUpdate(
            { email: 'superviseur@test.com' },
            {
                email: 'superviseur@test.com',
                password: '$2b$10$YourHashedPasswordHere',
                role: 'professeur',
                nom: 'Nom Superviseur',
                prenom: 'Prenom Superviseur'
            },
            { upsert: true, new: true }
        );

        // Créer des stages PFA
        const pfaStages = [
            {
                title: 'Développement d\'une application web',
                description: 'Création d\'une application web avec React et Node.js',
                type: 'PFA',
                startDate: new Date('2024-02-01'),
                endDate: new Date('2024-06-30'),
                student: student._id,
                supervisor: supervisor._id,
                status: 'En cours',
                company: {
                    name: 'TechCorp',
                    address: 'Casablanca',
                    supervisor: 'John Doe',
                    contact: 'contact@techcorp.com'
                }
            },
            {
                title: 'Système de gestion de bibliothèque',
                description: 'Développement d\'un système de gestion pour une bibliothèque universitaire',
                type: 'PFA',
                startDate: new Date('2024-02-01'),
                endDate: new Date('2024-06-30'),
                student: student._id,
                supervisor: supervisor._id,
                status: 'En cours',
                company: {
                    name: 'UnivTech',
                    address: 'Rabat',
                    supervisor: 'Jane Smith',
                    contact: 'contact@univtech.com'
                }
            },
            {
                title: 'Application mobile de suivi sportif',
                description: 'Développement d\'une application mobile pour le suivi des activités sportives',
                type: 'PFA',
                startDate: new Date('2024-02-01'),
                endDate: new Date('2024-06-30'),
                student: student._id,
                supervisor: supervisor._id,
                status: 'En cours',
                company: {
                    name: 'SportTech',
                    address: 'Marrakech',
                    supervisor: 'Mohammed Ali',
                    contact: 'contact@sporttech.com'
                }
            }
        ];

        // Supprimer les stages existants de type PFA
        await Internship.deleteMany({ type: 'PFA' });

        // Ajouter les nouveaux stages
        await Internship.insertMany(pfaStages);

        console.log('Données de test créées avec succès');
        console.log('Encadrants:', encadrants);
        console.log('Étudiants:', etudiants);
        console.log('✅ Données de test ajoutées avec succès');

        await mongoose.connection.close();
        console.log('Déconnecté de MongoDB');
    } catch (error) {
        console.error('Erreur lors du seeding:', error);
        console.error('❌ Erreur lors de l\'ajout des données de test:', error);
        process.exit(1);
    }
};

seedData();
