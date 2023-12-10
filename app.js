const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const realEstateRoutes = require('./routes/realEstateRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const visitRoutes = require('./routes/visitRoutes');
const installDatabase = require('./middleware/dbInstaller');
const User = require('./models/User');

const app = express();
const PORT = 3000;
const mongoURI = 'mongodb+srv://admin:admin@cluster0.wb1rayu.mongodb.net/API-Daniel?retryWrites=true&w=majority';

app.use(express.json());
app.use('/users', userRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/realEstate', realEstateRoutes);
app.use('/visits', visitRoutes); 

mongoose.set('strictQuery', false);

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await installDatabase(); 

    // Verifying and creating default admin user
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
          console.log('Default admin user created successfully!');
        }
      } catch (error) {
        console.error('Error creating admin user:', error);
      }
    };

    await createAdminUser();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exiting the process on DB connection error
  });
