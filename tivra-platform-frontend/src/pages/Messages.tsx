import React, { useEffect, useState } from 'react';
import { Mail, Search } from 'lucide-react';
import axios from 'axios';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${apiUrl}messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const filtered = messages.filter((msg) => {
    const sender = msg.sender?.username || '';
    const content = msg.content || '';
    return (
      sender.toLowerCase().includes(search.toLowerCase()) ||
      content.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex flex-col items-center py-12">
      <div className="w-full max-w-3xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl border border-green-100">
        <div className="flex items-center mb-8 gap-4">
          <Mail className="h-10 w-10 text-green-700" />
          <h1 className="text-3xl font-bold text-green-800">My Messages</h1>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-gray-500 text-center py-12">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            <p className="mb-2">No messages yet.</p>
            <p>Messages from sellers and transporters will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((msg) => (
              <div key={msg.id} className="p-4 rounded-lg border bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-green-700">From: {msg.sender?.username || 'Unknown'}</div>
                  <div className="text-gray-600 text-sm">{msg.content}</div>
                  <div className="text-gray-500 text-xs">{msg.timestamp && new Date(msg.timestamp).toLocaleString()}</div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Enquiry #{msg.enquiry}
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

export default Messages; 