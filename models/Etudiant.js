const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    filiere: {
        type: String,
        required: true,
        enum: ['Génie Informatique', 'Génie Civil', 'Génie Industriel', 'Génie Mécanique']
    },
    niveau: {
        type: String,
        required: true,
        enum: ['1ère année', '2ème année', '3ème année', '4ème année', '5ème année']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer une adresse email valide']
    },
    encadrant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Etudiant = mongoose.model('Etudiant', etudiantSchema);
module.exports = Etudiant;
