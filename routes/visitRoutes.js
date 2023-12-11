const express = require('express');
const router = express.Router();
const visit = require('../models/visit');
const authMiddleware = require('../middleware/authMiddleware');


router.use(authMiddleware);


/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: Endpoints relacionados a visitas
 */

/**
 * @swagger
 * /visits:
 *   get:
 *     summary: Lista todas as visitas com paginação
 *     description: Retorna uma lista de visitas com paginação.
 *     tags: [Visits]
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
 *         description: Lista de visitas obtida com sucesso
 *       '500':
 *         description: Erro interno do servidor
 */
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


/**
 * @swagger
 * /visits:
 *   post:
 *     summary: Cria uma nova visita
 *     description: Cria uma nova visita.
 *     tags: [Visits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visit'
 *     responses:
 *       '201':
 *         description: Visita criada com sucesso
 *       '400':
 *         description: Erro de requisição inválida
 */
// Rota para criar uma nova visita
router.post('/', async (req, res) => {
    try {
        const newVisit = await visit.create(req.body);
        res.status(201).json({ success: true, data: newVisit });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});


/**
 * @swagger
 * /visits/{id}:
 *   put:
 *     summary: Atualiza uma visita existente
 *     description: Atualiza uma visita existente com base no ID fornecido.
 *     tags: [Visits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da visita a ser atualizada
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Visit'
 *     responses:
 *       '200':
 *         description: Visita atualizada com sucesso
 *       '400':
 *         description: Erro de requisição inválida
 *       '404':
 *         description: Visita não encontrada
 */
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


/**
 * @swagger
 * /visits/{id}:
 *   delete:
 *     summary: Exclui uma visita existente
 *     description: Exclui uma visita existente com base no ID fornecido.
 *     tags: [Visits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da visita a ser excluída
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Visita excluída com sucesso
 *       '404':
 *         description: Visita não encontrada
 *       '500':
 *         description: Erro interno do servidor
 */
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
