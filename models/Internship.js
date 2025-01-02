const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['PFE', 'Stage', 'PFA'] // Ajout de PFA comme type possible
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['En cours', 'Terminé', 'Annulé'],
        default: 'En cours'
    },
    company: {
        name: String,
        address: String,
        supervisor: String,
        contact: String
    },
    documents: [{
        type: {
            type: String,
            enum: ['Rapport', 'Présentation', 'Autre']
        },
        name: String,
        path: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
