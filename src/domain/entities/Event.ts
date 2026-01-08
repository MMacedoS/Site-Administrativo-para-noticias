export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl?: string;
  order: number;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  imageUrl?: string;
  order?: number;
}
