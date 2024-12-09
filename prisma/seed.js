const prisma = require("../api/utils/db");
const { applicationTypes, evaluatorRegisterForSeeder } = require("./data");
console.log(typeof applicationTypes);
const evaluatorData = [
    {
        evaluator_id: "b7d5a3f8-8d9c-46f7-bf1b-f40b440f5f6e",
        email: "johndoe@example.com",
        phone: "9876543210",
        password: "ItsCu@123",
        state: "Maharashtra",
        district: "Mumbai",
        pincode: "400001",
        role: "Senior Evaluator",
        specialization: ["new_institute_0", "new_institute_1", "eoa_1", "eoa_3"]  // Evaluates new institution application documents and accreditation proof
    },
    {
        evaluator_id: "f9b240d4-2121-4c69-9357-5089d7cb3a19",
        email: "janedoe@example.com",
        phone: "9123456789",
        password: "ItsCu@123",
        state: "Karnataka",
        district: "Bangalore",
        pincode: "560001",
        role: "Junior Evaluator",
        specialization: ["collaboration_0", "collaboration_1", "collaboration_2"]  // Specializes in collaboration & twinning programs
    },
    {
        evaluator_id: "cbf66062-e8fc-4e5b-b467-b6f3ed3b3a2f",
        email: "peterparker@example.com",
        phone: "9122334455",
        password: "ItsCu@123",
        state: "Delhi",
        district: "New Delhi",
        pincode: "110001",
        role: "Evaluator",
        specialization: ["odl_ol_0", "odl_ol_1", "odl_ol_2"]  // Specializes in Open and Distance Learning (ODL) and Online Learning (OL)
    },
    {
        evaluator_id: "aee9ec07-2f9e-4b9d-a0b3-0a79941a0b56",
        email: "maryjane@example.com",
        phone: "9233445566",
        password: "ItsCu@123",
        state: "Tamil Nadu",
        district: "Chennai",
        pincode: "600001",
        role: "Lead Evaluator",
        specialization: ["penal_actions_0", "penal_actions_1"]  // Focuses on penal actions for norm violations
    },
    {
        evaluator_id: "d98b5bba-6ea0-4b2f-b0b5-0db37c6c5b92",
        email: "brucewayne@example.com",
        phone: "9344556677",
        password: "ItsCu@123",
        state: "Gujarat",
        district: "Ahmedabad",
        pincode: "380001",
        role: "Senior Evaluator",
        specialization: ["hibernation_0", "hibernation_2"]  // Specializes in hibernation or closure of institutions
    }
];

async function seed() {
    await prisma.universityApplication.deleteMany({});
    await prisma.universityDocuments.deleteMany({});
    await prisma.applicationDocuments.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.applicationTypes.deleteMany({});
    await prisma.evaluator.deleteMany({});
    const appTypes = applicationTypes; // Convert object to array

    for (const application of appTypes) {
        // Create ApplicationTypes record
        console.log(application)
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
    for (const evaluator of evaluatorData) {
        await evaluatorRegisterForSeeder(evaluator);
    }
}
seed()
    .then(() => {
        console.log("Database seeded successfully!");
    })
    .catch((error) => {
        console.error("Error seeding database: ", error);
    });