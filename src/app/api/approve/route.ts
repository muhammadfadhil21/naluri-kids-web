import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { products } from "@/data/products";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { id, email, nama_pembeli, nama_produk } = await req.json();

    if (!id || !email || !nama_pembeli || !nama_produk) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // 1. Cari produk untuk mendapatkan link download-nya
    const product = products.find((p) => p.name === nama_produk);
    const downloadUrl = product?.downloadUrl || "https://naluri-kids.com/contact-support";

    // 2. Update status di Supabase menjadi 'Success'
    const { error: dbError } = await supabase
      .from("transaksi")
      .update({ status: "Success" })
      .eq("id", id);

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    // 3. Kirim Email menggunakan Resend
    // Pastikan mengirim dari domain yang sudah di-verifikasi di Resend
    // Contoh: 'noreply@domain-anda.com'
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'; 

    const { error: emailError } = await resend.emails.send({
      from: `Naluri Kids <${senderEmail}>`,
      to: email,
      subject: `Akses Program Anda: ${nama_produk}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #3b82f6;">Terima Kasih, ${nama_pembeli}!</h2>
          <p>Pembayaran Anda untuk <strong>${nama_produk}</strong> telah kami terima dan verifikasi.</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <p style="margin-bottom: 20px;">Silakan unduh atau akses materi program Anda melalui tombol di bawah ini:</p>
            <a href="${downloadUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Akses ${nama_produk}
            </a>
            <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
              Atau gunakan link ini: <a href="${downloadUrl}">${downloadUrl}</a>
            </p>
          </div>
          
          <p>Jika ada pertanyaan, silakan hubungi kami via WhatsApp.</p>
          <p>Salam hangat,<br><strong>Tim Naluri Kids Programme</strong></p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Email sending failed:", emailError);
      // We don't throw error here to not fail the approval if only email fails,
      // but in production we might want to queue it or alert the admin.
      return NextResponse.json(
        { message: "Status diupdate, tapi gagal mengirim email.", details: emailError },
        { status: 200 } // partial success
      );
    }

    return NextResponse.json(
      { message: "Berhasil update status dan kirim email" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Approve endpoint error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
