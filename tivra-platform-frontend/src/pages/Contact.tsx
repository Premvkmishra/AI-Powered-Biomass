import React from 'react';
import { Mail, Phone, MapPin, Leaf } from 'lucide-react';

const Contact = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex flex-col justify-center items-center py-16">
    <div className="w-full max-w-3xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl border border-green-100">
      <div className="flex flex-col items-center mb-8">
        <Leaf className="h-16 w-16 text-green-600 mb-4 animate-bounce" />
        <h1 className="text-4xl font-bold text-green-800 mb-2">Contact Us</h1>
        <p className="text-gray-700 text-lg mb-4">Have questions, feedback, or need support? Reach out to the Tivra team!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="flex flex-col items-center">
          <Mail className="h-8 w-8 text-green-700 mb-2" />
          <span className="font-semibold">support@tivra.com</span>
        </div>
        <div className="flex flex-col items-center">
          <Phone className="h-8 w-8 text-green-700 mb-2" />
          <span className="font-semibold">+91-1234567890</span>
        </div>
        <div className="flex flex-col items-center">
          <MapPin className="h-8 w-8 text-green-700 mb-2" />
          <span className="font-semibold">123 Green Avenue, Biofuel City, India</span>
        </div>
      </div>
      <form className="space-y-4 max-w-xl mx-auto">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Name</label>
          <input id="name" type="text" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Your Name" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
          <input id="email" type="email" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Your Email" required />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 font-semibold mb-1">Message</label>
          <textarea id="message" className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="How can we help you?" rows={4} required />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition">Send Message</button>
      </form>
      <p className="text-gray-500 text-center mt-6">We aim to respond to all queries within 24 hours.</p>
    </div>
  </div>
);

export default Contact; 