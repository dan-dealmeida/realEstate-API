const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'realEstate-API',
            version: '1.0.2',
            description: 'API para cadastro de imóveis onde usuários podem favoritar imóveis e agendar visitas',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local Server',
            },
        ],
    },
    apis: ['./routes/*.js', './middleware/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;