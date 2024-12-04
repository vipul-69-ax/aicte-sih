const { getAssignedDocuments, actionOnAssignedApplications } = require("../../controllers/evaluator/data/data.controller");

const evaluatorData = require("express").Router();
evaluatorData.get("/assigned_docs", getAssignedDocuments);
evaluatorData.post("/action_on_doc", actionOnAssignedApplications);

module.exports = { evaluatorData };