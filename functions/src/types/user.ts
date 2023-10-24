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
