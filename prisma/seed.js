const prisma = require("../api/utils/db");
const applicationTypes = require("./data");
console.log(typeof applicationTypes);
async function seed() {
    await prisma.document.deleteMany({});
    await prisma.applicationTypes.deleteMany({});
    await prisma.applicationDocuments.deleteMany({});
    const appTypes = applicationTypes.applicationTypes; // Convert object to array

    for (const application of appTypes) {
        // Create ApplicationTypes record
        const appType = await prisma.applicationTypes.create({
            data: {
                application_id: application.application_id,
                application_name: application.application_name,
                application_description: application.application_description,
            }
        });

        // Create documents and link them to ApplicationTypes
        for (const doc of application.documents) {
            const document = await prisma.document.create({
                data: {
                    doc_id: doc.doc_id,
                    doc_name: doc.doc_name,
                    format_uri: doc.format_uri,
                },
            });

            // Link the document to the application type
            await prisma.applicationDocuments.create({
                data: {
                    application_id: appType.application_id,
                    doc_id: document.doc_id,
                },
            });
        }
    }
}
seed()
    .then(() => {
        console.log("Database seeded successfully!");
    })
    .catch((error) => {
        console.error("Error seeding database: ", error);
    });