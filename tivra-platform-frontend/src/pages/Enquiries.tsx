import React, { useEffect, useState } from 'react';
import { MessageSquare, Search } from 'lucide-react';
import axios from 'axios';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}enquiries/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnquiries(res.data);
      } catch (err) {
        setEnquiries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const filtered = enquiries.filter((enq) => {
    const product = enq.product?.commodity_type || '';
    const status = enq.status || '';
    return (
      product.toLowerCase().includes(search.toLowerCase()) ||
      status.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex flex-col items-center py-12">
      <div className="w-full max-w-3xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl border border-green-100">
        <div className="flex items-center mb-8 gap-4">
          <MessageSquare className="h-10 w-10 text-green-700" />
          <h1 className="text-3xl font-bold text-green-800">My Enquiries</h1>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Search enquiries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-gray-500 text-center py-12">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            <p className="mb-2">You have no enquiries yet.</p>
            <p>Start exploring products and send your first enquiry!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((enq) => (
              <div key={enq.id} className="p-4 rounded-lg border bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-green-700">{enq.product?.commodity_type || 'Product'}</div>
                  <div className="text-gray-600 text-sm">Quantity: {enq.quantity} | Offered: ₹{enq.offered_price}</div>
                  <div className="text-gray-500 text-xs">{enq.product?.pickup_location}</div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {enq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiries; 