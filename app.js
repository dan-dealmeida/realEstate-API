const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const setup = require('./setup');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

const PORT = 3000;





mongoose.set("strictQuery", false)
mongoose.
connect('mongodb+srv://admin:admin@cluster0.wb1rayu.mongodb.net/API-Daniel?retryWrites=true&w=majority')
.then(() => {
    console.log('conectado ao MongoDB')
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch((error) => {
    console.log(error)
})