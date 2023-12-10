const express = require('express');
const router = express.Router();
const realEstate = require('./models/realEstate');
const authMiddleware = require('./middleware/authMiddleware');

// Middleware para autenticação
router.use(authMiddleware);

// Rota para obter uma lista paginada de imóveis
router.get('/', async (req, res) => {
    try {
        const { limite = 10, pagina = 1 } = req.query;
        const limit = parseInt(limite);
        const skip = (parseInt(pagina) - 1) * limit;

        const realEstates = await realEstate
            .find()
            .limit(limit)
            .skip(skip)
            .exec();

        res.status(200).json({ success: true, data: realEstates });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Rota para criar um novo imóvel
router.post('/', async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        const newRealEstate = await realEstate.create(req.body);
        res.status(201).json({ success: true, data: newRealEstate });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Rota para atualizar um imóvel existente
router.put('/:id', async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        const updatedRealEstate = await realEstate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedRealEstate) {
            return res.status(404).json({ success: false, error: 'Real estate not found' });
        }

        res.status(200).json({ success: true, data: updatedRealEstate });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Rota para excluir um imóvel existente
router.delete('/:id', async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        const deletedRealEstate = await realEstate.findByIdAndDelete(req.params.id);

        if (!deletedRealEstate) {
            return res.status(404).json({ success: false, error: 'Real estate not found' });
        }

        res.status(200).json({ success: true, data: deletedRealEstate });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Rota para busca avançada de imóveis
router.get('/search', async (req, res) => {
    try {
        const { priceMin, priceMax, areaMin, areaMax, location, bedrooms } = req.query;

        // Construa um objeto de filtro com base nos parâmetros recebidos
        const filter = {};

        if (priceMin && priceMax) {
            filter.price = { $gte: parseFloat(priceMin), $lte: parseFloat(priceMax) };
        }

        if (areaMin && areaMax) {
            filter.area = { $gte: parseFloat(areaMin), $lte: parseFloat(areaMax) };
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' }; // Pesquisa case-insensitive
        }

        if (bedrooms) {
            filter.bedrooms = parseInt(bedrooms);
        }

        // Realize a busca com base nos critérios
        const searchResults = await RealEstate.find(filter);

        res.status(200).json({ results: searchResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
