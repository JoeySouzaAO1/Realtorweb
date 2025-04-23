export default function AdminDashboard() {
  return (
    <div className="min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p>Welcome to the admin dashboard.</p>
        </div>
      </div>
    </div>
  );
}
