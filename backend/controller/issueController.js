// backend/controllers/issueController.js

const Issue = require("../models/issueModel");

// 👉 POST /api/issues
const createIssue = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const issue = new Issue({
      title,
      description,
      location,
      date: new Date(),
    });

    const savedIssue = await issue.save();
    res.status(201).json(savedIssue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating issue" });
  }
};

// 👉 GET /api/issues
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ date: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching issues" });
  }
};

module.exports = { createIssue, getIssues };
