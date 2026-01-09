export interface Professional {
  id: number;
  name: string;
  cpf: string;
  registrationNumber: string; // Nº Registro CBOO
  status: string; // Regular, Irregular, etc
  formation: string; // Técnico em Óptica e Optometria, etc
  city: string;
  state: string; // UF
  registrationDate: Date; // Data Cadastro
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProfessionalDTO {
  name: string;
  cpf: string;
  registrationNumber: string;
  status: string;
  formation: string;
  city: string;
  state: string;
  registrationDate: Date;
}

export interface UpdateProfessionalDTO {
  name?: string;
  cpf?: string;
  registrationNumber?: string;
  status?: string;
  formation?: string;
  city?: string;
  state?: string;
  registrationDate?: Date;
}

export interface ProfessionalSearchResult {
  found: boolean;
  professional?: Professional;
  message?: string;
}
