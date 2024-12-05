const { LogAction, Doer, LogObject } = require("../../../services/enums");
const { actionLogger, Log } = require("../../../services/logging");
const prisma = require("../../../utils/db");

const allowedStatusActions = ['IN_REVIEW', 'APPROVED', 'REJECTED'];

const getAssignedDocuments = async (req, res) => {
    console.log(req);
    const authData = req.authData;
    if (authData.role != "evaluator") {
        res.status(401).json({ errors: "Not authorized as Evaluator." })
    }
    try {
        const assignedDocuments = await prisma.universityDocuments.findMany({ where: { evaluator_id: authData.evaluator_id } });
        return res.status(200).json({ data: assignedDocuments });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ errors: "Internal Server Error. Try again after some time." });
    }
}

const getAssignedDocumentById = async (req, res) => {
    const { evaluator_id } = req.authData;
    const { uni_doc_id } = req.params;
    try {
        const uniDoc = await prisma.universityDocuments.findUniqueOrThrow({ where: { uni_doc_id: uni_doc_id }, include: { document: { include: { application_type: true } } } });
        actionLogger.log(new Log(Date.now(), undefined, uni_doc_id, evaluator_id, LogAction.DOC_VIEWED, Doer.EVALUATOR, LogObject.DOCUMENT));
        return res.status(200).json({ data: uniDoc });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ errors: "Document not found." });
    }
}

const actionOnAssignedDocuments = async (req, res) => {
    const { uni_doc_id, messages, status } = req.body;
    const { evaluator_id } = req.authData;
    if (!allowedStatusActions.includes(status)) {
        return res.status(401).json({ errors: "You are not allowed to perform this actions." });
    }
    let data = {};
    if (status === "REJECTED" && !messages) {
        return res.status(400).json({ errors: "Please Provide reason for rejection." });
    }
    if (messages) {
        data = { messages: messages };
    }
    if (status) {
        data.status = status;
    }
    try {
        const updateDoc = await prisma.universityDocuments.update({ where: { evaluator_id: evaluator_id } }, { data: data });
        actionLogger.log(new Log(Date.now(), undefined, uni_doc_id, evaluator_id, status, Doer.EVALUATOR, LogObject.DOCUMENT));
        return res.status(200).json({ data: updateDoc, message: "Document Updated Successfully." })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ errors: "Failed To update the document" });
    }
}

const actionOnAssignedApplications = async (req, res) => {
    //TODO if time left then implement
}

module.exports = { actionOnAssignedApplications, actionOnAssignedDocuments, getAssignedDocuments }