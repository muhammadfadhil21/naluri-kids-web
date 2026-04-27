-- Skema Database untuk Naluri Kids Programme
-- Jalankan kode SQL ini di SQL Editor Supabase Anda

-- 1. Buat tabel transaksi
CREATE TABLE transaksi (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  nama_pembeli text NOT NULL,
  email text NOT NULL,
  wa text NOT NULL,
  nama_produk text NOT NULL,
  bukti_transfer_url text NOT NULL,
  status text DEFAULT 'pending' NOT NULL
);

-- 2. Atur keamanan (Row Level Security) agar Guest/Anon bisa insert data
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for anon users" 
ON "public"."transaksi" 
FOR INSERT 
WITH CHECK (true);

-- =========================================================================
-- BUCKET STORAGE UNTUK GAMBAR BUKTI TRANSFER
-- =========================================================================
-- Pastikan Anda juga membuat Storage Bucket bernama 'payment-proofs' 
-- dan menjadikannya PUBLIC. Kemudian, jalankan policy berikut di SQL Editor 
-- agar public/guest bisa meng-upload file ke bucket tersebut:

-- CREATE POLICY "Izinkan upload gambar untuk semua"
-- ON storage.objects FOR INSERT TO public
-- WITH CHECK (bucket_id = 'payment-proofs');

-- CREATE POLICY "Izinkan lihat gambar untuk semua"
-- ON storage.objects FOR SELECT TO public
-- USING (bucket_id = 'payment-proofs');
