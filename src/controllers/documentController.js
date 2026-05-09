const Document =
  require('../models/Document');


// UPLOAD DOCUMENT
exports.uploadDocument =
  async (req, res) => {

    try {

      const {
        category,
        docType,
        docName,
        label,
      } = req.body;

      // FILE URL
      const fileUrl =
        req.file?.path;

      if (!fileUrl) {

        return res.status(400).json({

          success: false,

          message: 'File Required',

        });

      }

      const document =
        await Document.create({

          category,

          docType,

          docName,

          label,

          fileUrl,

        });

      res.status(201).json({

        success: true,

        message:
          'Document Uploaded',

        document,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };

  // GET DOCUMENTS
exports.getDocuments =
  async (req, res) => {

    try {

      const {
        category,
        docType,
        docName,
      } = req.query;

      const documents =
        await Document.find({

          category,

          docType,

          docName,

        });

      res.status(200).json({

        success: true,

        documents,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };

  // DELETE DOCUMENT
exports.deleteDocument =
  async (req, res) => {

    try {

      const {id} = req.params;

      const document =
        await Document.findByIdAndDelete(id);

      if (!document) {

        return res.status(404).json({

          success: false,

          message: 'Document Not Found',

        });

      }

      res.status(200).json({

        success: true,

        message:
          'Document Deleted',

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };