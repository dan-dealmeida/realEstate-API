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



const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI); // Connect to MongoDB
    console.log('Connected to MongoDB');

    // Installation script after successful connection
    await installDatabase();

    // Start the server after database setup and admin creation
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      
      try {
        // Create admin user only after the installation script completes
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
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exiting the process on DB connection error
  }
};

// Call the function to connect and perform operations
connectToMongoDB();
