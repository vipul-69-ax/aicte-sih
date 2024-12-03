const prisma = require("../../../utils/db");

const availableApplication = async (req, res) => {
    const application = await prisma.applicationTypes.findMany({ include: { documents: true } });
    return res.json({ data: application });
}

const get_institute_data = async (req, res) => {
    const { instituteId } = req.body
    try {
        // const query = `
        //   SELECT institute_id, institute_data
        //   FROM institute WHERE id = $1; 
        // `;

        // const result = await db.query(query, [instituteId]);

        const result = await prisma.university.findUniqueOrThrow({ where: { id: instituteId } })
        res.status(200).json({
            success: true,
            data: result, // Returns an array of objects with institute_id and institute_data
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(401).json({
            success: false,
            message: "No institute found with given institue_id.",
        });
    }
}

const start_new_application = async (req, res) => {
    const { institute_id, application } = req.body;
    if (!institute_id || typeof application !== "object") {
        return res.status(400).json({
            success: false,
            message: "Invalid input: institute_id and a valid application object are required.",
        });
    }

    try {
        // Use UPSERT logic
        //         const query = `
        //       INSERT INTO applications (institute_id, application_data)
        // VALUES ($1, ARRAY[$2::jsonb])
        // ON CONFLICT (institute_id)
        // DO UPDATE SET application_data = array_append(applications.application_data, $2::jsonb)
        // RETURNING *;
        //     `;
        //         const values = [institute_id, application];

        //         const result = await db.query(query, values);

        const applicationRes = await prisma.universityApplication.create({
            data: {
                uni_application_id: application.uni_application_id, application_id: application.application_id, universityId: institute_id, UniversityDocuments: {
                    create: application.UniversityDocuments
                }
            }
        });

        res.status(200).json({
            id: applicationRes.uni_application_id,
            success: true,
            message: `Succesfully created ${applicationRes.uni_application_id}`,
            token: institute_id
        });
    } catch (error) {
        console.error("Error handling data:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}

const get_applications = async (req, res) => {
    const instituteId = req.query.id;
    console.log(instituteId)
    if (!instituteId) {
        return res.status(400).json({ error: "Institute ID is required" });
    }

    try {
        //     const query = `
        //     SELECT application_data
        //     FROM applications
        //     WHERE institute_id = $1;
        //   `;

        //     const result = await db.query(query, [instituteId]);
        const applications = await prisma.universityApplication.findMany({ orderBy: { createdOn: "desc" }, where: { universityId: instituteId }, include: { UniversityDocuments: true, application: true } });
        applications.documents = applications.UniversityDocuments;
        delete applications.UniversityDocuments;
        if (!applications) {
            return res.status(404).json({ error: "No applications found for this institute" });
        }

        res.status(200).json({
            success: true,
            data: applications, // Send the JSON data to the frontend
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const get_application_document_by_id = async (req, res) => {
    const { institute_id, application_id } = req.query;
    console.log(institute_id, application_id)
    if (!institute_id || !application_id) {
        return res.status(400).json({ error: "Institute ID and Application ID are required" });
    }

    try {
        //     const query = `
        //     SELECT application
        //     FROM (
        //       SELECT unnest(application_data) AS application
        //       FROM applications
        //       WHERE institute_id = $1
        //     ) subquery
        //     WHERE application ->> 'application_id' = $2;
        //   `;

        //     const values = [institute_id, application_id];

        //     const result = await db.query(query, values);
        const documents = await prisma.universityApplication.findUnique({ where: { uni_application_id: application_id, universityId: institute_id }, include: { application: true, UniversityDocuments: { include: { document: true } }, } });

        if (!documents) {
            return res.status(404).json({ error: "No application found with the given Application ID for the given instituteID." });
        }

        res.status(200).json({
            success: true,
            data: documents,
        });
    } catch (err) {
        console.error("Error fetching application data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { get_institute_data, start_new_application, get_applications, get_application_document_by_id, availableApplication }