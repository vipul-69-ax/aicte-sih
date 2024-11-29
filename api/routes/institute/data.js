const { get_institute_data, start_new_application, get_applications, get_application_document_by_id } = require("../../controllers/institute/data")

const InstitueData = require("express").Router()

InstitueData.post("/", get_institute_data)
InstitueData.post("/new_application", start_new_application)
InstitueData.get("/get_applications", get_applications)
InstitueData.get("/get_documents", get_application_document_by_id)

module.exports = { InstitueData }