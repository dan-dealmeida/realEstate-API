const mongoose = require('mongoose');

const visitSchema = mongoose.Schema(
    {
        realEstate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'realEstate', 
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now 
        }
    },
    {
        timestamps: true
    }
);

const visit = mongoose.model('visit', visitSchema);

module.exports = visit;
