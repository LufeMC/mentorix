export type User = {
  name: string;
  email: string;
  recipes: string[];
  password?: string;
  id?: string;
};

export type UserLogin = {
  name: string;
  email: string;
  password: string;
};
