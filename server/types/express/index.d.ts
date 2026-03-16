declare namespace Express {
  export interface User {
    id: string;
    admin: boolean;
    cart_id: string;
    default_address_id: string | null;
  }
  export interface Request {
    authInfo?: AuthInfo | undefined;
    user?: User | undefined;
  }
}
