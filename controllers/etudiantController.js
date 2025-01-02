const Etudiant = require('../models/Etudiant');

// Obtenir tous les étudiants
exports.getEtudiants = async (req, res) => {
    try {
        console.log('📥 GET /api/etudiants - Début de la requête');
        const etudiants = await Etudiant.find()
            .select('_id nom prenom filiere niveau email')
            .sort({ createdAt: -1 });
        
        console.log(`✅ GET /api/etudiants - ${etudiants.length} étudiants trouvés`);
        res.json(etudiants);
    } catch (error) {
        console.error('❌ GET /api/etudiants - Erreur:', error);
        res.status(500).json({ 
            success: false,
            message: 'Erreur lors de la récupération des étudiants',
            error: error.message 
        });
    }
};

// Créer un nouvel étudiant
exports.createEtudiant = async (req, res) => {
    try {
        console.log('📥 POST /api/etudiants - Données reçues:', req.body);
        const { nom, prenom, filiere, niveau, email } = req.body;

        if (!nom || !prenom || !filiere || !niveau || !email) {
            console.log('❌ POST /api/etudiants - Données manquantes');
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis'
            });
        }

        const etudiant = new Etudiant({
            nom,
            prenom,
            filiere,
            niveau,
            email
        });

        await etudiant.save();
        console.log('✅ POST /api/etudiants - Étudiant créé:', etudiant);
        res.status(201).json(etudiant);
    } catch (error) {
        console.error('❌ POST /api/etudiants - Erreur:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'étudiant',
            error: error.message
        });
    }
};

// Mettre à jour un étudiant
exports.updateEtudiant = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📥 PUT /api/etudiants/${id} - Données reçues:`, req.body);

        const etudiant = await Etudiant.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!etudiant) {
            console.log(`❌ PUT /api/etudiants/${id} - Étudiant non trouvé`);
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        console.log(`✅ PUT /api/etudiants/${id} - Étudiant mis à jour:`, etudiant);
        res.json(etudiant);
    } catch (error) {
        console.error(`❌ PUT /api/etudiants/${req.params.id} - Erreur:`, error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'étudiant',
            error: error.message
        });
    }
};

// Supprimer un étudiant
exports.deleteEtudiant = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📥 DELETE /api/etudiants/${id} - Début de la requête`);

        const etudiant = await Etudiant.findByIdAndDelete(id);

        if (!etudiant) {
            console.log(`❌ DELETE /api/etudiants/${id} - Étudiant non trouvé`);
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        console.log(`✅ DELETE /api/etudiants/${id} - Étudiant supprimé`);
        res.json({
            success: true,
            message: 'Étudiant supprimé avec succès'
        });
    } catch (error) {
        console.error(`❌ DELETE /api/etudiants/${req.params.id} - Erreur:`, error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'étudiant',
            error: error.message
        });
    }
};

// Obtenir un étudiant par ID
exports.getEtudiantById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📥 GET /api/etudiants/${id} - Début de la requête`);

        const etudiant = await Etudiant.findById(id)
            .select('_id nom prenom filiere niveau email');

        if (!etudiant) {
            console.log(`❌ GET /api/etudiants/${id} - Étudiant non trouvé`);
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        console.log(`✅ GET /api/etudiants/${id} - Étudiant trouvé:`, etudiant);
        res.json(etudiant);
    } catch (error) {
        console.error(`❌ GET /api/etudiants/${req.params.id} - Erreur:`, error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'étudiant',
            error: error.message
        });
    }
};
