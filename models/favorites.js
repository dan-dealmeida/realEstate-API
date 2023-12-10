const mongoose = require('mongoose');

const favoritesSchema = mongoose.Schema(
    {
        realEstates: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'realEstate', 
            required: true,
        }],
    },
    {
        timestamps: true
    }
);

const favorites = mongoose.model('favorites', favoritesSchema);

module.exports = favorites;
