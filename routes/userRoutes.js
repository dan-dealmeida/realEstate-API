const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints relacionados a usuários
 */

/**
 * @swagger
 * /users/cadastro:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um novo usuário com nome, email e senha.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso
 *       '400':
 *         description: Erros de validação ou usuário já existente
 *       '500':
 *         description: Erro interno do servidor
 */


router.post('/cadastro', 
  async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado!' });
      }

      

      const newUser = new User({
        nome,
        email,
        senha,
        role,
      });

      await newUser.save();
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o usuário!' });
    }
  }
);

/**
 * @swagger
 * /users/administradores:
 *   post:
 *     summary: Cria um novo administrador
 *     description: Cria um novo administrador com nome, email e senha.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Administrador criado com sucesso
 *       '400':
 *         description: Erros de validação ou email já em uso
 *       '403':
 *         description: Acesso negado ou não é um administrador
 *       '500':
 *         description: Erro interno do servidor
 */

// Rota para criar administradores
router.post('/administradores', async (req, res) => {
  // Verifica se o usuário logado é um administrador
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Somente administradores podem criar outros administradores.' });
  }

  const { nome, email, senha } = req.body;

  try {
    // Verifica se o e-mail já está em uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já está em uso.' });
    }

    // Cria um novo usuário com o papel de administrador
    const newAdmin = new User({
      nome,
      email,
      senha,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Administrador criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar o administrador.' });
  }
});


/**
 * @swagger
 * /users/usuarios/{id}:
 *   delete:
 *     summary: Exclui um usuário não administrador
 *     description: Exclui um usuário com base no ID fornecido.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Usuário excluído com sucesso
 *       '403':
 *         description: Acesso negado ou usuário não é um administrador
 *       '404':
 *         description: Usuário não encontrado ou é um administrador
 *       '500':
 *         description: Erro interno do servidor
 */
// Rota para excluir usuários não administradores
router.delete('/usuarios/:id', async (req, res) => {
  // Verifica se o usuário logado é um administrador
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Somente administradores podem excluir usuários.' });
  }

  const userId = req.params.id;

  try {
    // Verifica se o usuário a ser excluído não é um administrador
    const userToDelete = await User.findOne({ _id: userId, role: { $ne: 'admin' } });

    if (!userToDelete) {
      return res.status(404).json({ error: 'Usuário não encontrado ou é um administrador.' });
    }

    // Realiza a exclusão do usuário não administrador
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao excluir o usuário.' });
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autenticação de usuário
 *     description: Verifica as credenciais do usuário e gera um token JWT.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login bem-sucedido, token gerado
 *       '401':
 *         description: Credenciais inválidas
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */
// Rota para autenticação (login) e geração do token JWT
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Encontra o usuário pelo email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Verifica se a senha corresponde à senha armazenada no banco de dados
    const passwordMatch = await bcrypt.compare(senha, user.senha);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Se as credenciais são válidas, gera um token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao fazer login.' });
  }
});


/**
 * @swagger
 * /users/usuarios/{id}:
 *   put:
 *     summary: Atualiza dados do usuário
 *     description: Atualiza os dados do usuário com base no ID fornecido.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Dados do usuário atualizados com sucesso
 *       '403':
 *         description: Acesso negado ou usuário não tem permissão para atualizar
 *       '404':
 *         description: Usuário não encontrado
 *       '500':
 *         description: Erro interno do servidor
 */
// Rota para atualizar dados do usuário
router.put('/usuarios/:id', async (req, res) => {
  const userId = req.params.id;
  const userDataToUpdate = req.body;

  try {
    // Verifica se o usuário logado é um administrador ou é o próprio usuário que está tentando atualizar seus dados
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para atualizar os dados deste usuário.' });
    }

    // Atualiza os dados do usuário
    const updatedUser = await User.findByIdAndUpdate(userId, userDataToUpdate, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Dados do usuário atualizados com sucesso!', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar os dados do usuário.' });
  }
});

module.exports = router;
