const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
    etudiant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    encadrant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalRapport: {
        filename: String,
        path: String,
        uploadDate: Date
    },
    rapportCorrige: {
        filename: String,
        path: String,
        uploadDate: Date
    },
    observations: {
        type: String
    },
    status: {
        type: String,
        enum: ['soumis', 'corrige'],
        default: 'soumis'
    }
}, {
    timestamps: true
});

const Rapport = mongoose.model('Rapport', rapportSchema);
module.exports = Rapport;
