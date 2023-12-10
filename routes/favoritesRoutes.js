const express = require('express');
const router = express.Router();
const favorites = require('../models/favorites'); 
const authMiddleware = require('../middleware/authMiddleware'); 

// Rota para listar todos os favoritos com paginação
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { limite, pagina } = req.query;
        const parsedLimite = parseInt(limite);
        const parsedPagina = parseInt(pagina);

        // Verificar se os parâmetros são válidos
        if (![5, 10, 30].includes(parsedLimite)) {
            return res.status(400).json({ error: 'O parâmetro limite deve ser 5, 10 ou 30' });
        }

        const startIndex = (parsedPagina - 1) * parsedLimite;

        // Obter os favoritos com base na paginação
        const paginatedFavorites = await favorites
            .find({})
            .skip(startIndex)
            .limit(parsedLimite);

        res.status(200).json({ favorites: paginatedFavorites });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Rota para adicionar um novo favorito
router.post('/', authMiddleware, async (req, res) => {
    try {
        
        const newFavorite = await favorites.create(req.body);
        res.status(201).json({ message: 'Favorito criado com sucesso', favorite: newFavorite });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para atualizar um favorito existente
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedFavorite = await favorites.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFavorite) {
            return res.status(404).json({ error: 'Favorito não encontrado' });
        }
        res.status(200).json({ message: 'Favorito atualizado com sucesso', favorite: updatedFavorite });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota para excluir um favorito existente
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedFavorite = await favorites.findByIdAndDelete(req.params.id);
        if (!deletedFavorite) {
            return res.status(404).json({ error: 'Favorito não encontrado' });
        }
        res.status(200).json({ message: 'Favorito excluído com sucesso', deletedFavorite });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
