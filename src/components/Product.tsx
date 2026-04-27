"use client";
import { Product as ProductType } from "@/data/products";

interface ProductProps {
    product: ProductType;
}

export default function Product({ product }: ProductProps) {
    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Container Gambar */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                    {product.location}
                </div>
            </div>

            {/* Konten Teks */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {product.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Investasi</p>
                        <p className="text-lg font-black text-secondary">
                            Rp {Number(product.price).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                        Detail
                    </button>
                </div>
            </div>
        </div>
    );
}