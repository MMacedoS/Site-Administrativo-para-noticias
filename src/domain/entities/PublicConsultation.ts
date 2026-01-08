export interface PublicConsultation {
  id: number;
  title: string;
  description: string;
  content: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "closed";
  imageUrl?: string;
  documentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePublicConsultationDTO {
  title: string;
  description: string;
  content: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "closed";
  imageUrl?: string;
  documentUrl?: string;
}

export interface UpdatePublicConsultationDTO {
  title?: string;
  description?: string;
  content?: string;
  startDate?: Date;
  endDate?: Date;
  status?: "draft" | "active" | "closed";
  imageUrl?: string;
  documentUrl?: string;
}
