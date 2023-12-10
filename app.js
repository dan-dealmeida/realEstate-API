const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');

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


// Verificação e criação do usuário administrador padrão
const createAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      const newAdmin = new User({
        nome: 'Admin',
        email: 'admin@example.com',
        senha: 'senha123', 
        role: 'admin',
      });

      await newAdmin.save();
      console.log('Usuário administrador padrão criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  }
};

createAdminUser().then(() => {
  mongoose.connection.close();
});
