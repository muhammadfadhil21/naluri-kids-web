"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product as ProductType } from "@/data/products";
import Product from "./Product";
import ProgramModal from "./ProgramModal";
import CheckoutModal from "./CheckoutModal";

export default function Catalog() {
    const [items, setItems] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    // State untuk Modal Detail Program (Pop-out info)
    const [viewingProduct, setViewingProduct] = useState<ProductType | null>(null);
    
    // State untuk Modal Checkout (Form pendaftaran)
    const [checkoutProduct, setCheckoutProduct] = useState<ProductType | null>(null);

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
                        // Saat kartu/poster diklik, buka Modal Detail (viewingProduct)
                        onOpenModal={() => setViewingProduct(item)} 
                    />
                ))}
            </div>

            {/* Jika ada produk yang sedang di-view, tampilkan ProgramModal (Info Detail) */}
            {viewingProduct && (
                <ProgramModal
                    product={viewingProduct}
                    onClose={() => setViewingProduct(null)}
                    onDaftar={() => {
                        // Tutup detail, buka checkout
                        setCheckoutProduct(viewingProduct);
                        setViewingProduct(null);
                    }}
                />
            )}

            {/* Jika tombol "Daftar Sekarang" ditekan, tampilkan CheckoutModal (Form) */}
            {checkoutProduct && (
                <CheckoutModal
                    product={checkoutProduct}
                    onClose={() => setCheckoutProduct(null)}
                />
            )}
        </section>
    );
}