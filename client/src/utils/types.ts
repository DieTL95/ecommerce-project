export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type AuthType = {
  getUser: () => Promise<void>;
  isAuthenticated: boolean;
  user: Users | null;
  logout: () => Promise<void | string>;
  isLoading: boolean;
};

export type CartContextType = {
  cart: Cart | undefined;
  sum: number | undefined;
  loading: boolean;
  handleCart: () => void;
  addToCart: (quantity: number, product: Products) => Promise<void>;
  incrementCart: (currentQuantity: number, productId: string) => Promise<void>;

  decrementCart: (currentQuantity: number, productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  deleteCart: (productId: string) => Promise<void>;
};

export interface Cart {
  session_id: string | null;
  created_at: Date;
  id: string;
  cart_items: CartItems[] | undefined;
  updated_at: Date;
  user_id: string | null;
}

export interface CartItems {
  cart_id: string | null;
  created_at: Date;
  id: string;
  updated_at: Date;
  price: number | null;
  product: Products;
  quantity: number | undefined;
  total_price: number | null;
}

export interface Categories {
  created_at: Date;
  description: string | null;
  details?:
    | {
        material?: string | null | undefined;
        origin?: string | null | undefined;
      }
    | null
    | undefined;
  id: string;
  images?: Images[] | null;
  products: Products[];
  name: string;
}

export interface OrderItems {
  created_at?: Date;
  id?: string;
  order_id?: string | null;
  price: number | null;
  product: Products;
  quantity: number | undefined;
  updated_at?: Date;
}

export interface Orders extends OrderItems {
  address_id: string | null;
  created_at: Date;
  id: string;
  status: string | null;
  updated_at: Date;
  user_id: string | null;
  value: number;
  order_items: OrderItems[] | undefined;
}

export interface ProductCategory {
  amount: number | null;
  category_id: string;
  product_id: string;
}

export interface Products {
  created_at: Date;
  description: string;
  details: Json | null;
  id: string;
  images?: Images[];
  name: string;
  price: number;
  user_id: string | null;
  quantity: number | null;
}

export interface CountedResults<A> {
  results: A[];
  total: number;
  pages: number;
  nextPage: boolean;
  name?: string;
}

export interface Addresses {
  address_one: string;
  address_two: string;
  city: string;
  country: string;
  created_at: Date;
  email: string;
  label: string;
  id: string;
  full_name: string;
  phonenumber: number;
  province: string;
  user_id: string | null;
  zipcode: string;
}

export interface Frontpage {
  categories: Categories[];
  id: string;
  name: string;
  current: boolean | null;
  products: Products[];
}

export interface Users {
  created_at: Date;
  email: string;
  id: string;
  name: string;
  admin: boolean;
  cart_id: string;
  default_address_id: string | null;
  session_id: string;
}

export interface Images {
  public_id: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  url: string;
  secure_url: string;
}
