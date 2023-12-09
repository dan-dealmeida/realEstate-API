const express = require('express');
// const mongoose = require('mongoose');
// const userRoutes = require('./routes/userRoutes');

const app = express();
//app.use(express.json());

// mongoose.connect('mongodb://localhost/nomeDoSeuBanco', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// app.use('/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
