export type ApplicationDocument = {
  document_id: string;
  document_name: string;

  errors?: Record<string, any>[];
  user_document_uri?: string;
  format_uri: string;
  timestamp: Date;
  status: "approved" | "not approved";
};

export type Application = {
  application_id: string;
  application_name: string;
  application_description: string;
  application_type: string;
  documents: ApplicationDocument[];
};
