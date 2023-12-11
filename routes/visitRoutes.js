const express = require('express');
const router = express.Router();
const visit = require('../models/visit');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware);

// Rota para listar visitas com paginação
router.get('/', async (req, res) => {
    try {
        const { limite = 10, pagina = 1 } = req.query;
        const limit = parseInt(limite);
        const skip = (parseInt(pagina) - 1) * limit;

        const visits = await visit
            .find()
            .limit(limit)
            .skip(skip)
            .exec();

        res.status(200).json({ success: true, data: visits });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Rota para criar uma nova visita
router.post('/', async (req, res) => {
    try {
        const newVisit = await visit.create(req.body);
        res.status(201).json({ success: true, data: newVisit });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Rota para atualizar uma visita existente
router.put('/:id', async (req, res) => {
    try {
        const updatedVisit = await visit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedVisit) {
            return res.status(404).json({ success: false, error: 'Visit not found' });
        }

        res.status(200).json({ success: true, data: updatedVisit });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Rota para excluir uma visita existente
router.delete('/:id', async (req, res) => {
    try {
        const deletedVisit = await visit.findByIdAndDelete(req.params.id);

        if (!deletedVisit) {
            return res.status(404).json({ success: false, error: 'Visit not found' });
        }

        res.status(200).json({ success: true, data: deletedVisit });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
