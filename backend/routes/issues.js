const express = require("express");
const router = express.Router();
const { createIssue, getIssues } = require("../controllers/issueController");

// abhi bina auth ke
router.post("/", createIssue);
router.get("/", getIssues);

module.exports = router;
