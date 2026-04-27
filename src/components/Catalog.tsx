"use client";

import { useState } from "react";
import { products } from "@/data/products";
import CheckoutModal from "./CheckoutModal";
import type { Product } from "@/data/products";

export default function Catalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeCheckout = () => {
    setSelectedProduct(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Program Kami</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => handleBuyClick(product)}
                  className="px-5 py-2 bg-primary text-white font-medium rounded-full hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/30 active:scale-95"
                >
                  Beli
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <CheckoutModal product={selectedProduct} onClose={closeCheckout} />
      )}
    </section>
  );
}
