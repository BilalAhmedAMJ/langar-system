export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Manage your langar system configuration</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg shadow-black/30 hover:shadow-blue-500/20 hover:from-gray-700 hover:to-gray-600 transition-all duration-300 border border-gray-700 hover:border-blue-500/50">
          <div className="mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">🍽️</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Manage Menus
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">Configure dishes and adjust serving sizes for your events</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg shadow-black/30 hover:shadow-green-500/20 hover:from-gray-700 hover:to-gray-600 transition-all duration-300 border border-gray-700 hover:border-green-500/50">
          <div className="mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">🥕</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Manage Ingredients
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">Edit your ingredient inventory and measurement units</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-xl shadow-lg shadow-black/30 hover:shadow-purple-500/20 hover:from-gray-700 hover:to-gray-600 transition-all duration-300 border border-gray-700 hover:border-purple-500/50">
          <div className="mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <span className="text-xl">📋</span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Manage Recipes
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">Build and customize recipes with ingredient requirements</p>
        </div>
      </div>
    </div>
  );
}