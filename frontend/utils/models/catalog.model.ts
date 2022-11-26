export interface Gear {
  id: number;
  name: string;
  slug: string;
  category?: {
    id: number;
    name: string;
    path: string;
  };
}
