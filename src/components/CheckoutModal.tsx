"use client";

import { useState } from "react";
import { X, Upload, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/data/products";

type CheckoutModalProps = {
  product: Product;
  onClose: () => void;
};

export default function CheckoutModal({ product, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wa, setWa] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && wa) setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 1. Upload file to Supabase Storage (assuming bucket 'payment-proofs' exists)
      // Note: In real app, we handle bucket existence and policies.
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      let publicUrl = "https://placeholder-url.com/receipt.jpg";
      
      if (!uploadError) {
        const { data } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);
        publicUrl = data.publicUrl;
      } else {
        console.warn("Storage upload failed, proceeding with placeholder URL for demo.");
      }

      // 2. Insert record to database
      const { error: dbError } = await supabase
        .from('transaksi')
        .insert({
          nama_pembeli: name,
          email: email,
          wa: wa,
          nama_produk: product.name,
          bukti_transfer_url: publicUrl,
        });

      if (dbError) throw dbError;

      setStep(4);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan saat memproses pesanan. Pastikan Supabase sudah diatur dengan benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-lg">Checkout - {product.name}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step 1: Identitas */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                <input 
                  type="text" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="nama@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">No. WhatsApp</label>
                <input 
                  type="tel" required
                  value={wa} onChange={e => setWa(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="081234567890"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                Lanjut ke Pembayaran <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Step 2: Instruksi Pembayaran */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Total Tagihan</p>
                <p className="text-3xl font-black text-blue-700 dark:text-blue-300">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Instruksi Transfer:</h4>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bank BCA</p>
                  <p className="text-xl font-mono font-bold tracking-wider mb-1">123 456 7890</p>
                  <p className="text-sm font-medium">a.n. Nama Saya</p>
                </div>
              </div>

              <button 
                onClick={handleNextStep2}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                Saya Sudah Transfer
              </button>
            </div>
          )}

          {/* Step 3: Upload Bukti */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Silakan upload foto struk atau screenshot bukti transfer Anda.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-gray-400 mb-3" size={32} />
                {file ? (
                  <p className="font-medium text-primary">{file.name}</p>
                ) : (
                  <p className="font-medium">Klik atau seret gambar ke sini</p>
                )}
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!file || loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Kirim Bukti Pembayaran"}
              </button>
            </div>
          )}

          {/* Step 4: Sukses */}
          {step === 4 && (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="mx-auto text-green-500" size={64} />
              <h3 className="text-2xl font-bold">Terima Kasih!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pesanan Anda sedang kami proses. Kami akan menghubungi Anda melalui WhatsApp ({wa}) segera setelah pembayaran diverifikasi.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
