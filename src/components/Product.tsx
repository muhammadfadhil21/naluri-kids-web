"use client";
import { Product as ProductType } from "@/data/products"; // TAMBAHKAN INI

// Tambahkan onOpenModal di interface props
interface ProductProps {
    product: ProductType;
    onOpenModal: () => void;
}

export default function Product({ product, onOpenModal }: ProductProps) {
    return (
        // ... kode bagian atas tetap sama ...

        // Cari bagian button "Detail" di bawah, lalu tambahkan onClick:
        <button
            onClick={onOpenModal} // TAMBAHKAN INI
            className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg"
        >
            Detail
        </button>

        // ... sisa kode tetap sama ...
    );
}