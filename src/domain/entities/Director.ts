export interface Director {
  id: number;
  name: string;
  position: string;
  email: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDirectorDTO {
  name: string;
  position: string;
  email: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  order: number;
}

export interface UpdateDirectorDTO {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
  order?: number;
}
