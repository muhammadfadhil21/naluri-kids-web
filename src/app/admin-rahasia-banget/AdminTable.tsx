"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Loader2, ExternalLink } from "lucide-react";

type Transaction = {
  id: string;
  created_at: string;
  nama_pembeli: string;
  email: string;
  wa: string;
  nama_produk: string;
  bukti_transfer_url: string;
  status: string;
};

export default function AdminTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transaksi")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async (transaction: Transaction) => {
    if (!confirm(`Setujui transaksi dari ${transaction.nama_pembeli}? Email akan otomatis dikirim.`)) return;

    setApprovingId(transaction.id);

    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: transaction.id,
          email: transaction.email,
          nama_pembeli: transaction.nama_pembeli,
          nama_produk: transaction.nama_produk,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal melakukan approve");

      alert("Transaksi berhasil disetujui dan email telah dikirim!");
      fetchTransactions();
    } catch (error: any) {
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
            <th className="p-4 font-semibold text-sm">Tanggal</th>
            <th className="p-4 font-semibold text-sm">Pembeli</th>
            <th className="p-4 font-semibold text-sm">Kontak</th>
            <th className="p-4 font-semibold text-sm">Produk</th>
            <th className="p-4 font-semibold text-sm">Bukti Bayar</th>
            <th className="p-4 font-semibold text-sm">Status</th>
            <th className="p-4 font-semibold text-sm">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">
                Belum ada transaksi
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/50">
                <td className="p-4 text-sm">
                  {new Date(t.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4 text-sm font-medium">{t.nama_pembeli}</td>
                <td className="p-4 text-sm text-gray-500">
                  {t.email}<br />
                  <span className="text-xs text-blue-500">{t.wa}</span>
                </td>
                <td className="p-4 text-sm">{t.nama_produk}</td>
                <td className="p-4 text-sm">
                  <a href={t.bukti_transfer_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                    Lihat <ExternalLink size={14} />
                  </a>
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    t.status.toLowerCase() === 'success' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {t.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  {t.status.toLowerCase() === 'pending' && (
                    <button
                      onClick={() => handleApprove(t)}
                      disabled={approvingId === t.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-blue-600 disabled:opacity-50"
                    >
                      {approvingId === t.id ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <CheckCircle size={14} />
                      )}
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
