export interface User {
  access: string;
  refresh: string;
  user: {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
  };
}
