const Job = require('../models/Job');

const getJobs = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10, sortBy = 'date' } = req.query;
    
    const offset = (page - 1) * limit;

    const jobs = await Job.findAllByUserId(req.user.id, status, search, limit, offset, sortBy);
    const totalCount = await Job.countAllByUserId(req.user.id, status, search);

    res.json({
      success: true,
      message: 'Jobs fetched successfully',
      data: {
        jobs,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    const stats = await Job.getStats(req.user.id);
    
    res.json({
      success: true,
      message: 'Analytics fetched successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getReminders = async (req, res, next) => {
  try {
    const reminders = await Job.findReminders(req.user.id);
    res.json({
      success: true,
      message: 'Reminders fetched successfully',
      data: reminders
    });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { company_name, role, status, application_date, notes, priority, reminder_date } = req.body;
    
    if (!company_name || !role || !application_date) {
      return res.status(400).json({ success: false, message: 'Please provide company name, role, and application date', data: null });
    }

    // 1. Application-level Duplicate Check
    const isDuplicate = await Job.findDuplicate(req.user.id, company_name, role);
    if (isDuplicate) {
      return res.status(400).json({ success: false, message: 'You have already applied for this role at this company.', data: null });
    }

    // 2. Insert into database
    try {
      const result = await Job.create(
        req.user.id,
        company_name,
        role,
        status,
        application_date,
        notes,
        priority,
        reminder_date || null
      );

      const newJob = await Job.findById(result.insertId, req.user.id);
      res.status(201).json({
        success: true,
        message: 'Job application created successfully',
        data: newJob
      });
    } catch (dbError) {
      // 3. Guarantee constraint duplicate check
      if (dbError.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Duplicate exact job application exists.', data: null });
      }
      throw dbError; // Bubble up
    }
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { company_name, role, status, application_date, notes, priority, reminder_date } = req.body;

    const job = await Job.findById(id, req.user.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized', data: null });
    }

    await Job.update(id, req.user.id, company_name, role, status, application_date, notes, priority, reminder_date || null);
    const updatedJob = await Job.findById(id, req.user.id);
    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findById(id, req.user.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized', data: null });
    }

    await Job.delete(id, req.user.id);
    res.json({
      success: true,
      message: 'Job deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

const setReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reminder_date } = req.body;

    const job = await Job.findById(id, req.user.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized', data: null });
    }

    // Reuse update method by grabbing existing field arrays, modifying just reminder
    await Job.update(id, req.user.id, job.company_name, job.role, job.status, job.application_date, job.notes, job.priority, reminder_date || null);
    const updatedJob = await Job.findById(id, req.user.id);
    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getJobs,
  getJobStats,
  getReminders,
  createJob,
  updateJob,
  deleteJob,
  setReminder
};
