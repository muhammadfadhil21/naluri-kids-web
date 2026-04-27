"use client";

import { X } from "lucide-react";
import type { Product as ProductType } from "@/data/products";

interface ProgramModalProps {
  product: ProductType;
  onClose: () => void;
  onDaftar: () => void;
}

export default function ProgramModal({ product, onClose, onDaftar }: ProgramModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Tombol Tutup (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row max-h-[80vh] overflow-y-auto">
          {/* Bagian Gambar Kiri (atau Atas di HP) */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img 
              src={product.image_url} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            {/* Label Lokasi */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-primary shadow-sm uppercase tracking-wider">
              {product.location}
            </div>
          </div>

          {/* Bagian Detail Kanan (atau Bawah di HP) */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <h2 className="text-2xl md:text-3xl font-black text-secondary mb-4 leading-tight">
              {product.title}
            </h2>
            
            <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 mb-8 flex-grow">
              <p>{product.description}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
                Investasi Program
              </p>
              <p className="text-3xl font-black text-secondary mb-6">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </p>
              
              <button 
                onClick={onDaftar}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-2xl text-lg font-black transition-all shadow-lg shadow-yellow-200 active:scale-95 flex justify-center items-center gap-2"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
