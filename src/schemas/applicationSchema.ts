
export interface SubmitApplicationDocument  {
  uni_doc_id: string;
  doc_id: string;
  uni_doc_name: string;
  timestamp: Date;
};
export interface ApplicationDocument extends SubmitApplicationDocument {
  errors?: Record<string, any>[];
  uni_doc_uri?: string;
  timestamp: Date;
  document: Document;
  status: "NOT_SUBMITTED" | "SUBMITTED"| "PROCESSING"|"VERIFIED"|"APPROVED"|"REJECTED";
};

export type Document= {
  doc_id: string;
  doc_name: string;
  format_uri: string;
}

export type ServerApplicationTypes = {
  application_id: string;
  application_name: string;
  application_description: string;
  documents: { documentR:Document}[];
}
export interface SubmitUniversityApplication {
  uni_application_id: string;
  application_id: string;
  application_name: string;
  application_description: string;
};
export interface UniversityApplication extends SubmitUniversityApplication {
  UniversityDocuments: ApplicationDocument[];
  createdOn: Date;
  application: ServerApplicationTypes; 
};
