export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  specialization?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface CurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialization?: string;
  address?: string;
  dateOfBirth?: string;
  password: string;
  username: string;
  isActive: boolean;
  id: string;
  img?: string;
  myUsers: string[];
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UpdateDataStudent {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  address?: string;
  dateOfBirth?: string;
}
