export interface NavItem {
  title: string;
  href?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  card: NavItemWithChildren[];
  menu: NavItemWithChildren[];
}

export type MainNavItem = NavItemWithChildren;

export type Product = {
  id: number;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  inventory: number;
  status: string;
};
export type Post = {
  id: string;
  author: string;
  title: string;
  content: string;
  image: string;
  body: string;
  updatedAt: string;
  tags: string[];
};
