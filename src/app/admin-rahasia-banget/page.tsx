import AdminTable from "./AdminTable";

export const metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Kelola transaksi masuk dan kirim akses ke pembeli.
        </p>
      </div>

      <AdminTable />
    </div>
  );
}
