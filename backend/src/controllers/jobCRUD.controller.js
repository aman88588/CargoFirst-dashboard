const JobModel = require("../models/job.model");

const jobCreateController = async (req, res) => {
    try {
        const { jobTitle, jobDescription, lastDateToApply, companyName } = req.body;

        // Validate required fields
        if (!jobTitle || !jobDescription || !lastDateToApply || !companyName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (jobTitle, jobDescription, lastDateToApply, companyName)",
            });
        }

        // Validate date format
        const dateObj = new Date(lastDateToApply);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format for lastDateToApply",
            });
        }

        // Check if date is in the future
        if (dateObj < new Date()) {
            return res.status(400).json({
                success: false,
                message: "lastDateToApply must be a future date",
            });
        }

        // Create new job posting
        const newJob = await JobModel.create({
            jobTitle,
            jobDescription,
            lastDateToApply: dateObj,
            companyName,
        });

        return res.status(201).json({
            success: true,
            message: "Job posted successfully",
            data: newJob,
        });
    } catch (error) {
        console.error("Error in jobCreateController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating job",
            error: error.message,
        });
    }
};

const jobUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { jobTitle, jobDescription, lastDateToApply, companyName } = req.body;

        // Validate job ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required",
            });
        }

        // Check if job exists
        const existingJob = await JobModel.findById(id);
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Build update object (only include provided fields)
        const updateData = {};
        if (jobTitle) updateData.jobTitle = jobTitle;
        if (jobDescription) updateData.jobDescription = jobDescription;
        if (companyName) updateData.companyName = companyName;
        
        if (lastDateToApply) {
            const dateObj = new Date(lastDateToApply);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format for lastDateToApply",
                });
            }
            if (dateObj < new Date()) {
                return res.status(400).json({
                    success: false,
                    message: "lastDateToApply must be a future date",
                });
            }
            updateData.lastDateToApply = dateObj;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        // Update job
        const updatedJob = await JobModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob,
        });
    } catch (error) {
        console.error("Error in jobUpdateController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating job",
            error: error.message,
        });
    }
};

const jobDeleteController = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate job ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required",
            });
        }

        // Check if job exists and delete
        const deletedJob = await JobModel.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            data: deletedJob,
        });
    } catch (error) {
        console.error("Error in jobDeleteController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting job",
            error: error.message,
        });
    }
};

const jobListController = async (req, res) => {
    try {
        // Get query parameters for filtering and pagination
        const { 
            page = 1, 
            limit = 10, 
            companyName, 
            jobTitle,
            sortBy = 'lastDateToApply',
            order = 'asc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (companyName) {
            filter.companyName = { $regex: companyName, $options: 'i' }; // Case-insensitive search
        }
        if (jobTitle) {
            filter.jobTitle = { $regex: jobTitle, $options: 'i' };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build sort object
        const sort = {};
        sort[sortBy] = order === 'desc' ? -1 : 1;

        // Fetch jobs with pagination
        const jobs = await JobModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalJobs = await JobModel.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            data: {
                jobs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalJobs / parseInt(limit)),
                    totalJobs,
                    jobsPerPage: parseInt(limit),
                },
            },
        });
    } catch (error) {
        console.error("Error in jobListController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching jobs",
            error: error.message,
        });
    }
};

module.exports = {
    jobCreateController,
    jobUpdateController,
    jobDeleteController,
    jobListController,
};