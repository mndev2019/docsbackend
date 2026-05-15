const Notification =
  require('../models/Notification');


// ================= GET NOTIFICATIONS =================
exports.getNotifications =
  async (req, res) => {

    try {

      // USER ID FROM PARAMS
      const { userId } =
        req.params;

      // FIND ONLY THIS USER NOTIFICATIONS
      const notifications =
        await Notification.find({

          userId,

        }).sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        notifications,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };