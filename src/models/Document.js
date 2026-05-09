const mongoose = require('mongoose');

const documentSchema =
  new mongoose.Schema({

    userId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: 'User',

    },

    category: {

      type: String,

      required: true,

    },

    docType: {

      type: String,

      required: true,

    },

    docName: {

      type: String,

      required: true,

    },

    label: {

      type: String,

      required: true,

    },

    fileUrl: {

      type: String,

      required: true,

    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Document',
  documentSchema
);