export type Product = {
  id: string | number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  downloadUrl?: string; // Tambahkan ini agar baris 22 tidak error
};

export const products: Product[] = [];