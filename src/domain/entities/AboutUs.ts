export interface AboutUs {
  id: number;
  title: string;
  content: string;
  mission?: string;
  vision?: string;
  values?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAboutUsDTO {
  title: string;
  content: string;
  mission?: string;
  vision?: string;
  values?: string;
  imageUrl?: string;
}

export interface UpdateAboutUsDTO {
  title?: string;
  content?: string;
  mission?: string;
  vision?: string;
  values?: string;
  imageUrl?: string;
}
