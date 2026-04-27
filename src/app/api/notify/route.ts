import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nama, email, wa, produk, linkBukti } = body;

        const data = await resend.emails.send({
            from: 'Naluri Kids <onboarding@resend.dev>',
            to: ['email-pribadi-kamu@gmail.com'], // GANTI DENGAN EMAIL KAMU
            subject: `🔔 PENDAFTARAN BARU: ${produk}`,
            html: `
        <h2>Ada Pendaftaran Baru Mom!</h2>
        <p><strong>Nama:</strong> ${nama}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${wa}</p>
        <p><strong>Program:</strong> ${produk}</p>
        <hr />
        <p>Cek bukti transfer di sini:</p>
        <a href="${linkBukti}" style="background: #fbbf24; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">Lihat Bukti Transfer</a>
      `
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal kirim notifikasi' }, { status: 500 });
    }
}