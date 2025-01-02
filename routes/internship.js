const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// Get all internships
router.get('/', async (req, res) => {
    try {
        const type = req.query.type;
        let query = {};
        
        if (type) {
            query.type = type;
        }
        
        const internships = await Internship.find(query)
            .populate('student')
            .populate('supervisor');
            
        res.json(internships);
    } catch (error) {
        console.error('Error fetching internships:', error);
        res.status(500).json({ message: 'Error fetching internships', error: error.message });
    }
});

// Create new internship
router.post('/', async (req, res) => {
    try {
        const internship = new Internship(req.body);
        await internship.save();
        res.status(201).json(internship);
    } catch (error) {
        res.status(400).json({ message: 'Error creating internship', error: error.message });
    }
});

// Update internship
router.put('/:id', async (req, res) => {
    try {
        const internship = await Internship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }
        res.json(internship);
    } catch (error) {
        res.status(400).json({ message: 'Error updating internship', error: error.message });
    }
});

// Delete internship
router.delete('/:id', async (req, res) => {
    try {
        const internship = await Internship.findByIdAndDelete(req.params.id);
        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }
        res.json({ message: 'Internship deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting internship', error: error.message });
    }
});

module.exports = router;
