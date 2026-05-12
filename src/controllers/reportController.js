const Report = require('../models/Report');

exports.reportProblem = async (req, res) => {

    try {

        const {
            issueType,
            description,
            email,
        } = req.body;

        if (
            !issueType ||
            !description ||
            !email
        ) {

            return res.status(400).json({

                success: false,
                message: 'All fields required',

            });

        }

        const screenshot = req.file
            ? req.file.path
            : '';

        const report = await Report.create({

            issueType,

            description,

            email,

            screenshot,

            userId: req.user.id,

        });

        res.status(201).json({

            success: true,

            message: 'Report submitted successfully',

            report,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};



exports.getAllReports = async (req, res) => {

    try {

        const reports = await Report.find()

            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: reports.length,

            reports,

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};