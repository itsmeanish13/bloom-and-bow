export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryId: string | null;
  categoryRef?: { id: string; name: string; slug: string } | null;
  occasions: string[];
  price: number;
  imageUrl: string | null;
  stockStatus: string;
  badges: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export type Occasion =
  | "birthday"
  | "anniversary"
  | "just_because"
  | "thank_you"
  | "sorry"
  | "new_home";

export const OCCASIONS: { slug: Occasion; label: string }[] = [
  { slug: "birthday", label: "Birthday" },
  { slug: "anniversary", label: "Anniversary" },
  { slug: "just_because", label: "Just Because" },
  { slug: "thank_you", label: "Thank You" },
  { slug: "sorry", label: "Sorry" },
  { slug: "new_home", label: "New Home" },
];

export function formatPrice(paisa: number): string {
  const rupees = paisa / 100;
  return `Rs ${rupees.toLocaleString("en-NP")}`;
}