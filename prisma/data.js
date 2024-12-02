const applicationTypes = [
    {
        application_id: "new_institute",
        application_name: "New Institute Application",
        application_description: "This application type is for establishing new educational institutions.",
        documents: [
            {
                doc_id: "new_institute_0",
                doc_name: "Affidavit 1: Application verification and compliance",
                format_uri: "https://www.dropbox.com/scl/fi/0w3n45pktfxniidcg02jq/APH-Final-201.pdf?rlkey=ba2c9qi5rvyuyi8595tdbx59t&st=doedbrw0&raw=1",
            },
            {
                doc_id: "new_institute_1",
                doc_name: "Affidavit 2: Sworn statement of data accuracy",
                format_uri: "https://www.aicte-india.org/sites/default/files/AFFIDAVIT-2%20for%20the%20applications%20submitted%20under%20chapter%201%202%204.pdf",
            },
            {
                doc_id: "new_institute_2",
                doc_name: "Land Ownership documents",
                format_uri: "/pdfs/new-institutions/land-ownership.pdf",
            },
            {
                doc_id: "new_institute_3",
                doc_name: "Lease agreement (if applicable)",
                format_uri: "/pdfs/new-institutions/lease-agreement.pdf",
            },
            {
                doc_id: "new_institute_4",
                doc_name: "Land Use Certificate",
                format_uri: "/pdfs/new-institutions/land-use-certificate.pdf",
            },
            {
                doc_id: "new_institute_5",
                doc_name: "Building Plan",
                format_uri: "/pdfs/new-institutions/building-plan.pdf",
            },
            {
                doc_id: "new_institute_6",
                doc_name: "Financial Proof",
                format_uri: "/pdfs/new-institutions/financial-proof.pdf",
            },
            {
                doc_id: "new_institute_7",
                doc_name: "Digital Signature Certificate (DSC)",
                format_uri: "/pdfs/new-institutions/dsc.pdf",
            },
            {
                doc_id: "new_institute_8",
                doc_name: "Society/Trust/Company Registration Certificate",
                format_uri: "/pdfs/new-institutions/registration-certificate.pdf",
            },
            {
                doc_id: "new_institute_9",
                doc_name: "Detailed Project Report (DPR)",
                format_uri: "/pdfs/new-institutions/dpr.pdf",
            },
            {
                doc_id: "new_institute_10",
                doc_name: "Compliance Documents",
                format_uri: "/pdfs/new-institutions/compliance-documents.pdf",
            },
            {
                doc_id: "new_institute_11",
                doc_name: "State NOC",
                format_uri: "/pdfs/new-institutions/state-noc.pdf",
            }
        ],
    },
    {
        application_id: "eoa",
        application_name: "Extension of Approval (EoA)",
        application_description: "This application type is for extending approval for existing institutions.",
        documents: [
            {
                doc_id: "eoa_0",
                doc_name: "Self-Disclosure Format",
                format_uri: "/pdfs/eoa/self-disclosure.pdf",
            },
            {
                doc_id: "eoa_1",
                doc_name: "Accreditation Proof",
                format_uri: "/pdfs/eoa/accreditation-proof.pdf",
            },
            {
                doc_id: "eoa_2",
                doc_name: "Admission Reports",
                format_uri: "/pdfs/eoa/admission-reports.pdf",
            },
            {
                doc_id: "eoa_3",
                doc_name: "Financial Statements",
                format_uri: "/pdfs/eoa/financial-statements.pdf",
            },
            {
                doc_id: "eoa_4",
                doc_name: "Infrastructure Readiness Report",
                format_uri: "/pdfs/eoa/infrastructure-report.pdf",
            },
            {
                doc_id: "eoa_5",
                doc_name: "State/University Affiliation Letter",
                format_uri: "/pdfs/eoa/affiliation-letter.pdf",
            },
            {
                doc_id: "eoa_6",
                doc_name: "Fee Payment Proof",
                format_uri: "/pdfs/eoa/fee-payment-proof.pdf",
            }
        ],
    },
    {
        application_id: "collaboration",
        application_name: "Collaboration & Twinning Programs",
        application_description: "This application type is for collaborations and academic twinning programs.",
        documents: [
            {
                doc_id: "collaboration_0",
                doc_name: "Memorandum of Understanding (MoU)",
                format_uri: "/pdfs/collaboration/mou.pdf",
            },
            {
                doc_id: "collaboration_1",
                doc_name: "Approval Letters",
                format_uri: "/pdfs/collaboration/approval-letters.pdf",
            },
            {
                doc_id: "collaboration_2",
                doc_name: "Course Curricula",
                format_uri: "/pdfs/collaboration/course-curricula.pdf",
            },
            {
                doc_id: "collaboration_3",
                doc_name: "Governance and Management Structure",
                format_uri: "/pdfs/collaboration/governance-structure.pdf",
            }
        ],
    },
    {
        application_id: "odl_ol",
        application_name: "Open and Distance Learning (ODL)/Online Learning (OL)",
        application_description: "This application type is for open and distance learning or online learning programs.",
        documents: [
            {
                doc_id: "odl_ol_0",
                doc_name: "LMS Infrastructure Proof",
                format_uri: "/pdfs/odl-ol/lms-infrastructure.pdf",
            },
            {
                doc_id: "odl_ol_1",
                doc_name: "Academic Records",
                format_uri: "/pdfs/odl-ol/academic-records.pdf",
            },
            {
                doc_id: "odl_ol_2",
                doc_name: "Content Accreditation",
                format_uri: "/pdfs/odl-ol/content-accreditation.pdf",
            },
            {
                doc_id: "odl_ol_3",
                doc_name: "Student Support Details",
                format_uri: "/pdfs/odl-ol/student-support.pdf",
            }
        ],
    },
    {
        application_id: "penal_actions",
        application_name: "Penal Actions (For Norm Violations)",
        application_description: "This application type is for penal actions and compliance for norm violations.",
        documents: [
            {
                doc_id: "penal_actions_0",
                doc_name: "Compliance Report",
                format_uri: "/pdfs/penal-actions/compliance-report.pdf",
            },
            {
                doc_id: "penal_actions_1",
                doc_name: "Supporting Evidence",
                format_uri: "/pdfs/penal-actions/supporting-evidence.pdf",
            },
            {
                doc_id: "penal_actions_2",
                doc_name: "Affidavit",
                format_uri: "/pdfs/penal-actions/affidavit.pdf",
            }
        ],
    },
    {
        application_id: "hibernation",
        application_name: "Hibernation or Closure of Institutions",
        application_description: "This application type is for the hibernation or closure of institutions.",
        documents: [
            {
                doc_id: "hibernation_0",
                doc_name: "Affidavit",
                format_uri: "/pdfs/hibernation-closure/affidavit.pdf",
            },
            {
                doc_id: "hibernation_1",
                doc_name: "Notification to Stakeholders",
                format_uri: "/pdfs/hibernation-closure/stakeholder-notification.pdf",
            },
            {
                doc_id: "hibernation_2",
                doc_name: "Student Transition Plan",
                format_uri: "/pdfs/hibernation-closure/student-transition-plan.pdf",
            },
            {
                doc_id: "hibernation_3",
                doc_name: "Financial Settlement Proof",
                format_uri: "/pdfs/hibernation-closure/financial-settlement.pdf",
            }
        ],
    },
];
module.exports = { applicationTypes }