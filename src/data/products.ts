export type Product = {
  id: string | number;
  title: string;       // Pastikan bukan 'name'
  description: string;
  price: number;
  image_url: string;   // Pastikan bukan 'imageUrl'
  location: string;
};

export const products: Product[] = [];