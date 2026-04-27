"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product as ProductType } from "@/data/products";
import Product from "./Product";
import CheckoutModal from "./CheckoutModal"; // Import modalnya

export default function Catalog() {
    const [items, setItems] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    // Logika untuk menyimpan produk yang sedang dipilih
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    useEffect(() => {
        async function fetchPrograms() {
            const { data, error } = await supabase.from("programs").select("*");
            if (!error) setItems(data || []);
            setLoading(false);
        }
        fetchPrograms();
    }, []);

    if (loading) return <div className="text-center py-20">Memuat...</div>;

    return (
        <section>
            <h2 className="text-4xl font-black text-secondary mb-12 text-center">Program Kami</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((item) => (
                    <Product
                        key={item.id}
                        product={item}
                        onOpenModal={() => setSelectedProduct(item)} // Kirim fungsi klik ke kartu
                    />
                ))}
            </div>

            {/* Jika ada produk yang dipilih, tampilkan modalnya */}
            {selectedProduct && (
                <CheckoutModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </section>
    );
}