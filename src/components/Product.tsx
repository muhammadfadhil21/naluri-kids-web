"use client";
import { Product as ProductType } from "@/data/products";

interface ProductProps {
    product: ProductType;
    onOpenModal: () => void;
}

export default function Product({ product, onOpenModal }: ProductProps) {
    return (
        <div className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* Container Gambar */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                {/* Label Lokasi di Atas Gambar */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black text-primary shadow-sm uppercase tracking-wider">
                    {product.location}
                </div>
            </div>

            {/* Konten Teks */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-secondary mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {product.description}
                </p>

                {/* Bagian Bawah (Harga & Tombol) */}
                <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Investasi</p>
                        <p className="text-lg font-black text-secondary">
                            Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                    </div>

                    <button
                        onClick={onOpenModal}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-yellow-200 active:scale-95"
                    >
                        Detail
                    </button>
                </div>
            </div>
        </div>
    );
}