const prisma = require("../utils/db");

let unverifiedDocuments = [];
let allUnverifiedDocuments = [];
let ForgeryEvaluator = [];
let LayoutEvaluator = [];
let ContentEvaluator = [];
let allEvaluators = [ForgeryEvaluator, LayoutEvaluator, ContentEvaluator];
async function refetch() {
    let layer_index = 0;
    for (const layer of ["FORGERY_CHECKER", "LAYOUT_CHECKER", "CONTENT_CHECKER"]) {
        const data = await prisma.evaluator.findMany({ where: { role: layer }, include: { assigned_document: { where: { status: "ASSIGNED" } } } });
        allEvaluators[layer_index] = data.sort((a, b) => a.assigned_document.length - b.assigned_document.length);
        layer_index++;
    };
    const data = await prisma.universityDocuments.findMany({ where: { status: "SUBMITTED", }, include: { document: true, assigned_evaluator: true } });
    console.log("Started Evaluator Matcher.", data);
    unverifiedDocuments = data.sort((doc_a, doc_b) => doc_a.document.deadline.getTime() - doc_b.document.deadline.getTime());
    allUnverifiedDocuments = [new Array(...unverifiedDocuments), new Array(...unverifiedDocuments), new Array(...unverifiedDocuments)]
    return setTimeout(() => { console.log("All data fetched.") }, 1000);
};
refetch().then(() => {
    assignDocumentToEvaluator().then(() => { console.log("Successfully assigned Documents to Evaluators.") });
});
async function assignDocumentToEvaluator(allEvaluator = allEvaluators) {
    console.log(allEvaluator.length, allEvaluator);
    console.log("unverifiedDocument", unverifiedDocuments);
    const assigned = [];
    let layer_index = 0;
    for (const layer of ["FORGERY_CHECKER", "LAYOUT_CHECKER", "CONTENT_CHECKER"]) {
        while (allEvaluator[layer_index][0].assigned_document.length < 10 && allUnverifiedDocuments[layer_index].length != 0) {
            for (let i = 0; i < allEvaluator[layer_index].length && allUnverifiedDocuments[layer_index].length != 0; i++) {
                let flag = false;
                allUnverifiedDocuments[layer_index].forEach((document, index) => {
                    if (allEvaluator[layer_index][i].specialization.includes(document.doc_id) && allEvaluator[layer_index][i].assigned_document.length < 10) {
                        assigned.push({ evaluator_id: allEvaluator[layer_index][i].evaluator_id, uni_doc_id: document.uni_doc_id, check_type: layer });
                        flag = true;
                        allUnverifiedDocuments[layer_index].splice(index, 1);
                    }
                });
                if (!flag) {
                    const index = Math.floor(Math.random() * allUnverifiedDocuments[layer_index].length);
                    const document = allUnverifiedDocuments[layer_index][index];
                    allUnverifiedDocuments[layer_index].splice(index, 1);
                    assigned.push({ evaluator_id: allEvaluator[layer_index][i].evaluator_id, uni_doc_id: document.uni_doc_id, check_type: layer });
                    allUnverifiedDocuments[layer_index].splice(index, 1);
                }
            };
        }
        await refetch();
        await pushAssignedToDB(assigned);
        layer_index++;
    }
    return assigned;
}

async function pushAssignedToDB(assigned) {
    console.log("assigned", assigned);
    try {
        await prisma.$transaction(async (prisma) => {
            for (const assignment of assigned) {
                await prisma.universityDocuments.update({ where: { uni_doc_id: assignment.uni_doc_id }, data: { status: "ASSIGNED" } });
                await prisma.evaluatorDocumentRelation.create({ data: { evaluator_id: assignment.evaluator_id, uni_doc_id: assignment.uni_doc_id, check_type: assignment.check_type, status: "ASSIGNED" } })
            }
        });
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = { assignDocumentToEvaluator };