export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  downloadUrl: string;
};

export const products: Product[] = [
  {
    id: "prog-1",
    name: "Montessori Sensorial Kit",
    description: "Program pengenalan bentuk, warna, dan tekstur untuk anak usia 2-4 tahun. Mengembangkan indera peraba dan visual.",
    price: 150000,
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
    downloadUrl: "https://naluri-kids.com/download/montessori-sensorial-kit.pdf"
  },
  {
    id: "prog-2",
    name: "Practical Life Series",
    description: "Melatih kemandirian anak dengan aktivitas sehari-hari seperti menuang air, melipat, dan merapikan mainan.",
    price: 200000,
    imageUrl: "https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?w=800&q=80",
    downloadUrl: "https://naluri-kids.com/download/practical-life-series.pdf"
  },
  {
    id: "prog-3",
    name: "Early Math Adventures",
    description: "Pengenalan konsep matematika dasar melalui benda konkret. Belajar berhitung jadi lebih menyenangkan.",
    price: 250000,
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80",
    downloadUrl: "https://naluri-kids.com/download/early-math-adventures.pdf"
  }
];
