const mongoose = require('mongoose');
const User = require('../models/User');
const RealEstate = require('../models/realEstate');
const Favorite = require('../models/favorites');
const Visit = require('../models/visit');
const { Types: { ObjectId } } = mongoose;

async function installDatabase() {
    
  try {
    // Criação de dados para inserção nas coleções
    const usersData = [
      { nome: 'Usuário 1', email: 'usuario1@example.com', senha: 'senha123', role: 'user' },
      { nome: 'Usuário 2', email: 'usuario2@example.com', senha: 'senha456', role: 'user' },
      { nome: 'Usuário 3', email: 'usuario3@example.com', senha: 'senha123', role: 'user' },
      { nome: 'Usuário 4', email: 'usuario4@example.com', senha: 'senha456', role: 'user' },
      { nome: 'Usuário 5', email: 'usuario5@example.com', senha: 'senha123', role: 'user' },
    ];

    const realEstatesData = [
        {
          name: 'Propriedade 1',
          adress: 'Endereço da propriedade 1',
          price: 100000 
        },
        {
          name: 'Propriedade 2',
          adress: 'Endereço da propriedade 2',
          price: 150000 
        },
        {
          name: 'Propriedade 3',
          adress: 'Endereço da propriedade 3',
          price: 200000 
        },
        {
          name: 'Propriedade 4',
          adress: 'Endereço da propriedade 4',
          price: 180000 
        },
        {
          name: 'Propriedade 5',
          adress: 'Endereço da propriedade 5',
          price: 220000 
        }
      ];

    
      const realEstateIds = [
        new ObjectId(), 
        new ObjectId(),
        new ObjectId(),
        new ObjectId(),
        new ObjectId(),
      ];
  

      const favoritesData = [
        { realEstates: [realEstateIds[0]] },
        { realEstates: [realEstateIds[1]] },
        { realEstates: [realEstateIds[2]] },
        { realEstates: [realEstateIds[3]] },
        { realEstates: [realEstateIds[4]] },
      ];

    const visitsData = [
        {
            realEstate: realEstateIds[0],
            date: new Date('2023-01-01') // Data da visita para a propriedade 1
          },
          {
            realEstate: realEstateIds[1],
            date: new Date('2023-02-15') // Data da visita para a propriedade 2
          },
          {
            realEstate: realEstateIds[2],
            date: new Date('2023-03-20') // Data da visita para a propriedade 3
          },
          {
            realEstate: realEstateIds[3],
            date: new Date('2023-04-10') // Data da visita para a propriedade 4
          },
          {
            realEstate: realEstateIds[4],
            date: new Date('2023-05-05') // Data da visita para a propriedade 5
          }
    ];

    // Inserção de dados nas coleções
    await User.insertMany(usersData);
    await RealEstate.insertMany(realEstatesData);
    await Favorite.insertMany(favoritesData);
    await Visit.insertMany(visitsData);

    console.log('Instalação do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao instalar banco de dados:', error);
  }
}

module.exports = installDatabase;