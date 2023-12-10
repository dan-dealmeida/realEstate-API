const mongoose = require('mongoose')

const realEstateSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        adress: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true
    }
)


const realEstate = mongoose.model('realEstate', realEstateSchema);

module.exports = realEstate;