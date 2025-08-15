import React from 'react';
import { MapPin, Search } from 'lucide-react';

const TransporterRoutes = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex flex-col items-center py-12">
    <div className="w-full max-w-3xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl border border-green-100">
      <div className="flex items-center mb-8 gap-4">
        <MapPin className="h-10 w-10 text-green-700" />
        <h1 className="text-3xl font-bold text-green-800">My Routes</h1>
      </div>
      <div className="mb-6 flex items-center gap-2">
        <Search className="h-5 w-5 text-gray-400" />
        <input className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Search routes..." />
      </div>
      <div className="text-gray-500 text-center py-12">
        <p className="mb-2">You have no routes yet.</p>
        <p>Your assigned or saved routes will appear here.</p>
      </div>
    </div>
  </div>
);

export default TransporterRoutes; 