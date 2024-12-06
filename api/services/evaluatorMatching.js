const prisma = require("../utils/db");

let unverifiedDocuments = [];
let allEvaluators = [];
async function refetch() {
    const ev = prisma.evaluator.findMany({ include: { assigned_document: { where: { status: "ASSIGNED" } } } }).then((data) => {
        allEvaluators = data.sort((a, b) => a.assigned_document.length - b.assigned_document.length);
    });
    const ud = prisma.universityDocuments.findMany({ where: { status: "VERIFIED" }, include: { document: true } }).then((data) => {
        console.log("Started Evaluator Matcher.");
        unverifiedDocuments = data.sort((doc_a, doc_b) => doc_a.document.deadline.getTime() - doc_b.document.deadline.getTime());
    });
    return Promise.all([ev, ud]).then(([allEvaluators, unverifiedDocuments]) => {
        return { allEvaluators, unverifiedDocuments };
    })
};
refetch().then(() => { assignDocumentToEvaluator().then(() => { console.log("Successfully assigned Documents to Evaluators.") }) });
async function assignDocumentToEvaluator(allEvaluator = allEvaluators) {
    const assigned = [];
    while (allEvaluator[0].assigned_document.length < 10 && unverifiedDocuments.length != 0) {

        for (let i = 0; i < allEvaluator.length && unverifiedDocuments.length != 0; i++) {
            let flag = false;
            unverifiedDocuments.forEach((document, index) => {
                if (allEvaluator[i].specialization.includes(document.doc_id) && allEvaluator[i].assigned_document.length < 10) {
                    assigned.push({ evaluator_id: allEvaluator[i].evaluator_id, uni_doc_id: document.uni_doc_id });
                    flag = true;
                }
                unverifiedDocuments.splice(index, 1);
            });
            if (!flag) {
                const index = Math.floor(Math.random() * unverifiedDocuments.length);
                const document = unverifiedDocuments[index];
                unverifiedDocuments.splice(index, 1);
                assigned.push({ evaluator_id: allEvaluator[i].evaluator_id, uni_doc_id: document.uni_doc_id });
            }
        };
        await pushAssignedToDB(assigned);
        await refetch();
    }
    return assigned;
}

async function pushAssignedToDB(assigned) {
    try {
        await prisma.$transaction(async (prisma) => {
            for (const assignment of assigned) {
                await prisma.universityDocuments.update({ where: { uni_doc_id: assignment.uni_doc_id }, data: { evaluator_id: assignment.evaluator_id, status: "ASSIGNED" } })
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = { assignDocumentToEvaluator };