export interface Contact {
  id: number;
  email: string;
  phone: string;
  address: string;
  workingHours?: string;
  mapUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContactDTO {
  email: string;
  phone: string;
  address: string;
  workingHours?: string;
  mapUrl?: string;
}

export interface UpdateContactDTO {
  email?: string;
  phone?: string;
  address?: string;
  workingHours?: string;
  mapUrl?: string;
}
