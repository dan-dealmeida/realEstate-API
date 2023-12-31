const express = require('express');
const router = express.Router();
const favorites = require('../models/favorites'); 
const authMiddleware = require('../middleware/authMiddleware'); 


/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Endpoints relacionados a favoritos
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Lista todos os favoritos com paginação
 *     description: Retorna uma lista de favoritos com paginação.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Limite de resultados por página (5, 10, ou 30)
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *         description: Número da página
 *     responses:
 *       '200':
 *         description: Lista de favoritos obtida com sucesso
 *       '400':
 *         description: Erro de requisição inválida
 *       '500':
 *         description: Erro interno do servidor
 */
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


/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Adiciona um novo favorito
 *     description: Adiciona um novo favorito à lista.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       '201':
 *         description: Favorito criado com sucesso
 *       '400':
 *         description: Erro de requisição inválida
 *       '500':
 *         description: Erro interno do servidor
 */
// Rota para adicionar um novo favorito
router.post('/', authMiddleware, async (req, res) => {
    try {
        
        const newFavorite = await favorites.create(req.body);
        res.status(201).json({ message: 'Favorito criado com sucesso', favorite: newFavorite });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


/**
 * @swagger
 * /favorites/{id}:
 *   put:
 *     summary: Atualiza um favorito existente
 *     description: Atualiza um favorito existente com base no ID fornecido.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do favorito a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Favorite'
 *     responses:
 *       '200':
 *         description: Favorito atualizado com sucesso
 *       '400':
 *         description: Erro de requisição inválida
 *       '404':
 *         description: Favorito não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */
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


/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     summary: Exclui um favorito existente
 *     description: Exclui um favorito existente com base no ID fornecido.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do favorito a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Favorito excluído com sucesso
 *       '404':
 *         description: Favorito não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */
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
