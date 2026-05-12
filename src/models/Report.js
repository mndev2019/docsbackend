const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({

    issueType: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    screenshot: {
        type: String,
        default: '',
    },

    email: {
        type: String,
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model(
    'Report',
    reportSchema
);