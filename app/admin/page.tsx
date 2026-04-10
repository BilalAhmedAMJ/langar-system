export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg shadow-black/20">
          <h2 className="text-xl font-semibold">
            Manage Menus
          </h2>
          <p>Edit dishes and serving sizes.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg shadow-black/20">
          <h2 className="text-xl font-semibold">
            Manage Ingredients
          </h2>
          <p>Edit supply inventory.</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg shadow-black/20">
          <h2 className="text-xl font-semibold">
            Manage Recipes
          </h2>
          <p>Build and edit recipes.</p>
        </div>
      </div>
    </div>
  );
}