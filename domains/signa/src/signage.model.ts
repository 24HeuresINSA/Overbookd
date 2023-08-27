export interface Signage {
  id: number;
  name: string;
  slug: string;
  image?: string;
  owner?: string;
  category?: {
    id: number;
    name: string;
    path: string;
  };
}
