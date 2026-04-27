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
      // 1. Upload file ke Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL gambar
      const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // 2. Simpan data ke tabel 'transaksi'
      const { error: dbError } = await supabase
        .from('transaksi')
        .insert({
          nama_pembeli: name,
          email: email,
          wa: wa,
          nama_produk: product.title,
          bukti_transfer_url: publicUrl,
          status: 'Pending' // Default status
        });

      if (dbError) throw dbError;

      // 3. KIRIM NOTIFIKASI KE EMAIL ADMIN (RESEND)
      // Ini bagian yang kita tambahkan
      try {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nama: name,
            email: email,
            wa: wa,
            produk: product.title,
            linkBukti: publicUrl
          }),
        });
      } catch (emailErr) {
        // Kita tidak 'throw' error di sini supaya pendaftaran tetap dianggap sukses 
        // di mata user meskipun notifikasi email gagal terkirim.
        console.error("Gagal mengirim notifikasi email:", emailErr);
      }

      setStep(4);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan. Pastikan database dan storage sudah siap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg line-clamp-1 text-slate-800 dark:text-white">Checkout - {product.title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="Masukkan nama Anda"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="nama@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">No. WhatsApp</label>
                <input
                  type="tel" required
                  value={wa} onChange={e => setWa(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="081234567890"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-[0.98]"
              >
                Lanjut ke Pembayaran <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Step 2: Instruksi Pembayaran */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
                <p className="text-3xl font-black text-primary">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 dark:text-slate-200">Instruksi Transfer:</h4>
                <div className="p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:bg-slate-800 relative group">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Bank Central Asia (BCA)</p>
                  <p className="text-xl font-mono font-bold tracking-widest text-secondary">8240 8179 19</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-slate-400">a.n. Anindya Cipta Putri</p>
                </div>
              </div>

              <button
                onClick={handleNextStep2}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                Saya Sudah Transfer
              </button>
            </div>
          )}

          {/* Step 3: Upload Bukti */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all relative group cursor-pointer">
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="text-primary" size={28} />
                  </div>
                  {file ? (
                    <div className="space-y-1">
                      <p className="font-bold text-primary">{file.name}</p>
                      <p className="text-xs text-gray-400">Klik untuk mengganti foto</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-gray-700 dark:text-slate-200">Upload Bukti Transfer</p>
                      <p className="text-xs text-gray-400">Ambil foto struk atau screenshot</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Kirim Sekarang"}
              </button>
            </div>
          )}

          {/* Step 4: Sukses */}
          {step === 4 && (
            <div className="text-center py-10 space-y-5 animate-in slide-in-from-bottom duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="text-green-500" size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800 dark:text-white">Pembayaran Terkirim!</h3>
                <p className="text-gray-500 text-sm px-6">
                  Terima kasih, Kak! Pembayaran untuk <b>{product.title}</b> akan kami verifikasi. Konfirmasi akan dikirim ke WhatsApp <b>{wa}</b>.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}