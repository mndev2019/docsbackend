
const Document =
  require('../models/Document');

const cloudinary =
  require('../config/cloudinary');

const Notification =
  require('../models/Notification');


// ================= UPLOAD DOCUMENT =================
exports.uploadDocument =
  async (req, res) => {

    try {

      const {
        userId,
        category,
        docType,
        docName,
        label,
      } = req.body;

      // FILE URL
      const fileUrl =
        req.file?.path;

      // CLOUDINARY PUBLIC ID
      const publicId =
        req.file?.filename;

      // FILE CHECK
      if (!fileUrl) {

        return res.status(400).json({

          success: false,

          message: 'File Required',

        });

      }

      // ================= CREATE DOCUMENT =================
      const document =
        await Document.create({

          userId,

          category,

          docType,

          docName,

          label,

          fileUrl,

          publicId,

        });


      // ================= CREATE NOTIFICATION =================
      await Notification.create({

        userId,

        title: 'Document Uploaded',

        message:
          `${docName} uploaded successfully`,

        type: 'upload',

      });


      res.status(201).json({

        success: true,

        message:
          'Document Uploaded',

        document,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };


// ================= GET DOCUMENTS =================
exports.getDocuments =
  async (req, res) => {

    try {

      const {
        userId,
        category,
        docType,
        docName,
      } = req.query;

      // FIND USER DOCUMENTS ONLY
      const documents =
        await Document.find({

          userId,

          category,

          docType,

          docName,

        });

      res.status(200).json({

        success: true,

        documents,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };


// ================= DELETE DOCUMENT =================
exports.deleteDocument =
  async (req, res) => {

    try {

      const { id } = req.params;

      // FIND DOCUMENT
      const document =
        await Document.findById(id);

      // DOCUMENT NOT FOUND
      if (!document) {

        return res.status(404).json({

          success: false,

          message: 'Document Not Found',

        });

      }

      // ================= CLOUDINARY DELETE =================
      let cloudinaryResponse;

      // TRY IMAGE DELETE
      cloudinaryResponse =
        await cloudinary.uploader.destroy(

          document.publicId,

          {
            resource_type: 'image',
          }

        );

      // IF IMAGE NOT FOUND THEN TRY RAW
      if (
        cloudinaryResponse.result === 'not found'
      ) {

        cloudinaryResponse =
          await cloudinary.uploader.destroy(

            document.publicId,

            {
              resource_type: 'raw',
            }

          );

      }


      // ================= DELETE FROM DATABASE =================
      await Document.findByIdAndDelete(id);


      // ================= CREATE NOTIFICATION =================
      await Notification.create({

        userId:
          document.userId,

        title:
          'Document Deleted',

        message:
          `${document.docName} deleted successfully`,

        type:
          'delete',

      });


      res.status(200).json({

        success: true,

        message:
          'Document Deleted Successfully',

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };



  //admin
  exports.getUserDocuments = async (req, res) => {

  try {

    const { userId } = req.params;

    const documents = await Document.find({
      userId,
    }).sort({ createdAt: -1 });

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