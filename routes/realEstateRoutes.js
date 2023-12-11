const express = require('express');
const router = express.Router();
const realEstate = require('../models/realEstate');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware para autenticação
router.use(authMiddleware);


/**
 * @swagger
 * tags:
 *   name: RealEstate
 *   description: Endpoints relacionados a imóveis
 */

/**
 * @swagger
 * /realEstate:
 *   get:
 *     summary: Lista todos os imóveis com paginação
 *     description: Retorna uma lista de imóveis com paginação.
 *     tags: [RealEstate]
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *         description: Limite de resultados por página
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *         description: Número da página
 *     responses:
 *       '200':
 *         description: Lista de imóveis obtida com sucesso
 *       '500':
 *         description: Erro interno do servidor
 */
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


/**
 * @swagger
 * /realEstate:
 *   post:
 *     summary: Cria um novo imóvel
 *     description: Cria um novo imóvel.
 *     tags: [RealEstate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RealEstate'
 *     responses:
 *       '201':
 *         description: Imóvel criado com sucesso
 *       '400':
 *         description: Erro de requisição inválida
 *       '403':
 *         description: Não autorizado
 */
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


/**
 * @swagger
 * /realEstate/{id}:
 *   put:
 *     summary: Atualiza um imóvel existente
 *     description: Atualiza um imóvel existente com base no ID fornecido.
 *     tags: [RealEstate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do imóvel a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RealEstate'
 *     responses:
 *       '200':
 *         description: Imóvel atualizado com sucesso
 *       '400':
 *         description: Erro de requisição inválida
 *       '403':
 *         description: Não autorizado
 *       '404':
 *         description: Imóvel não encontrado
 */
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


/**
 * @swagger
 * /realEstate/{id}:
 *   delete:
 *     summary: Exclui um imóvel existente
 *     description: Exclui um imóvel existente com base no ID fornecido.
 *     tags: [RealEstate]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do imóvel a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Imóvel excluído com sucesso
 *       '403':
 *         description: Não autorizado
 *       '404':
 *         description: Imóvel não encontrado
 */
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


/**
 * @swagger
 * /realEstate/search:
 *   get:
 *     summary: Realiza busca avançada de imóveis
 *     description: Realiza uma busca avançada de imóveis com base em filtros opcionais.
 *     tags: [RealEstate]
 *     parameters:
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: integer
 *         description: Preço mínimo do imóvel
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: integer
 *         description: Preço máximo do imóvel
 *       - in: query
 *         name: areaMin
 *         schema:
 *           type: integer
 *         description: Área mínima do imóvel
 *       - in: query
 *         name: areaMax
 *         schema:
 *           type: integer
 *         description: Área máxima do imóvel
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Localização do imóvel (pesquisa case-insensitive)
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: Número de quartos do imóvel
 *     responses:
 *       '200':
 *         description: Resultados da busca obtidos com sucesso
 *       '500':
 *         description: Erro interno do servidor
 */
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
