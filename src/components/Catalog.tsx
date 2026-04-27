"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Product as ProductType } from "@/data/products"; // Mengambil tipe data
import Product from "./Product"; // Mengambil komponen kartu

export default function Catalog() {
    const [items, setItems] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPrograms() {
            // Mengambil data dari tabel 'programs' di Supabase
            const { data, error } = await supabase
                .from("programs")
                .select("*");

            if (error) {
                console.error("Error fetching from Supabase:", error);
            } else {
                setItems(data || []);
            }
            setLoading(false);
        }
        fetchPrograms();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <p className="animate-pulse text-gray-500 font-medium">Menyiapkan Program Seru...</p>
        </div>
    );

    return (
        <section className="w-full">
            <div className="flex flex-col items-center mb-12">
                <h2 className="text-4xl font-black text-secondary mb-4 text-center">Program Kami</h2>
                <div className="h-1.5 w-20 bg-primary rounded-full"></div>
            </div>

            {items.length === 0 ? (
                <p className="text-center text-gray-500">Belum ada program tersedia saat ini.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item) => (
                        <Product key={item.id} product={item} />
                    ))}
                </div>
            )}
        </section>
    );
}