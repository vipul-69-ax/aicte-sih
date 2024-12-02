export type ApplicationDocument = {
  uni_doc_id: string;
  doc_id: string;
  uni_doc_name: string;
  errors?: Record<string, any>[];
  uni_doc_uri?: string;
  timestamp: Date;
  status: "NOT_SUBMITTED" | "SUBMITTED"| "PROCESSING"|"VERIFIED"|"APPROVED"|"REJECTED";
};

export type Application = {
  uni_application_id: string;
  application_name: string;
  application_description: string;
  application_id: string;
  documents: ApplicationDocument[];
};
