export type User = {
  name: string;
  email: string;
  recipes: string[];
  planRenewalDate: string;
  recipesGenerated: number;
  premium: boolean;
  password?: string;
  id?: string;
  customerId?: string;
  renewed?: boolean;
};

export type UserLogin = {
  name: string;
  email: string;
  password: string;
};
