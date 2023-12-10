// authMiddleware.js

const jwt = require('jsonwebtoken');
const { User } = require('./models'); // Suponha que este seja o modelo de usuário

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET); 

        // Verificar se o usuário existe no banco de dados
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        // Passar o usuário decodificado para as rotas
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
