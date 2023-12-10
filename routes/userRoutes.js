const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

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
      });

      await newUser.save();
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o usuário!' });
    }
  }
);

// Outras rotas relacionadas aos usuários podem ser definidas aqui

module.exports = router;
