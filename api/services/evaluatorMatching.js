const prisma = require("../utils/db");

let unverifiedDocuments = [];
let allUnverifiedDocuments = [];
let ForgeryEvaluator = [];
let LayoutEvaluator = [];
let ContentEvaluator = [];
let allEvaluator = [ForgeryEvaluator, LayoutEvaluator, ContentEvaluator];
async function refetch() {
    let layer_index = 0;
    for (const layer of ["FORGERY_CHECKER", "LAYOUT_CHECKER", "CONTENT_CHECKER"]) {
        const data = await prisma.evaluator.findMany({ where: { role: layer }, include: { assigned_document: { where: { status: "ASSIGNED" } } } });
        allEvaluator[layer_index] = data.sort((a, b) => a.assigned_document.length - b.assigned_document.length);
        layer_index++;
    };
    const data = await prisma.universityDocuments.findMany({ where: { status: "SUBMITTED", }, include: { document: true, assigned_evaluator: true } });
    console.log("Started Evaluator Matcher.", data);
    unverifiedDocuments = data.sort((doc_a, doc_b) => doc_a.document.deadline.getTime() - doc_b.document.deadline.getTime());
    allUnverifiedDocuments = [new Array(...unverifiedDocuments), new Array(...unverifiedDocuments), new Array(...unverifiedDocuments)]
    return setTimeout(() => { console.log("All data fetched.") }, 1000);
};
// refetch().then(() => {
//     assignDocumentToEvaluator().then(() => { console.log("Successfully assigned Documents to Evaluators.") });
// });
async function assignDocumentToEvaluator(allEvaluators = allEvaluator) {
    console.log(allEvaluators.length, allEvaluators);
    console.log("unverifiedDocuments", allUnverifiedDocuments);

    let assigned = [];
    const layers = ["FORGERY_CHECKER", "LAYOUT_CHECKER", "CONTENT_CHECKER"];

    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
        const layer = layers[layerIndex];
        assigned = [];
        console.log(layerIndex, layer);

        // Get the evaluators and unverified documents for the current layer
        const evaluators = allEvaluators[layerIndex];
        let unverifiedDocs = allUnverifiedDocuments[layerIndex];

        // Assign documents based on evaluator specialization and capacity
        for (let i = 0; i < evaluators.length && unverifiedDocs.length > 0; i++) {
            const evaluator = evaluators[i];
            while (evaluator.assigned_document.length < 10 && unverifiedDocs.length > 0) {
                const docIndex = unverifiedDocs.findIndex((doc) =>
                    evaluator.specialization.includes(doc.doc_id)
                );

                if (docIndex !== -1) {
                    const document = unverifiedDocs[docIndex];
                    assigned.push({
                        evaluator_id: evaluator.evaluator_id,
                        uni_doc_id: document.uni_doc_id,
                        check_type: layer,
                    });
                    evaluator.assigned_document.push(document); // Update evaluator's assigned documents
                    unverifiedDocs.splice(docIndex, 1); // Remove the assigned document
                } else {
                    break; // Exit if no matching document is found
                }
            }
        }

        // Assign remaining unverified documents randomly within the same layer
        while (unverifiedDocs.length > 0) {
            const doc = unverifiedDocs.pop(); // Get the next document
            const randomIndex = Math.floor(Math.random() * evaluators.length);
            const randomEvaluator = evaluators[randomIndex];

            // Assign the document to the random evaluator
            assigned.push({
                evaluator_id: randomEvaluator.evaluator_id,
                uni_doc_id: doc.uni_doc_id,
                check_type: layer,
            });
            randomEvaluator.assigned_document.push(doc); // Update evaluator's assigned documents
        }

        // Push assignments to the database
        await pushAssignedToDB(assigned);

        // Refresh data
        await refetch();
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