import React from 'react';
import { Leaf, Users, Truck, ShoppingCart, Star } from 'lucide-react';

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex flex-col justify-center items-center py-16">
    <div className="w-full max-w-4xl mx-auto p-8 bg-white/90 rounded-3xl shadow-2xl border border-green-100">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="flex-shrink-0 flex flex-col items-center">
          <Leaf className="h-20 w-20 text-green-600 mb-4 animate-spin-slow" />
          <span className="text-4xl font-extrabold text-green-700 tracking-tight">Tivra</span>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">About Tivra</h1>
          <p className="text-gray-700 text-lg mb-4">
            Tivra is a digital marketplace platform for the biofuel value chain, connecting buyers, sellers, transporters, and admins. Our mission is to streamline agricultural commodity trading and logistics with a modern, accessible, and efficient platform.
          </p>
          <p className="text-gray-600 mb-2">
            We empower all stakeholders in the supply chain with real-time dashboards, secure transactions, and transparent analytics. Join us in building a sustainable future for agriculture and biofuels.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mt-8">
        <div className="flex flex-col items-center">
          <ShoppingCart className="h-10 w-10 text-green-500 mb-2" />
          <span className="font-bold text-lg text-green-700">Buyers</span>
          <span className="text-gray-500">Find and purchase quality commodities</span>
        </div>
        <div className="flex flex-col items-center">
          <Users className="h-10 w-10 text-yellow-500 mb-2" />
          <span className="font-bold text-lg text-yellow-700">Sellers</span>
          <span className="text-gray-500">List and sell your products nationwide</span>
        </div>
        <div className="flex flex-col items-center">
          <Truck className="h-10 w-10 text-blue-500 mb-2" />
          <span className="font-bold text-lg text-blue-700">Transporters</span>
          <span className="text-gray-500">Deliver and manage logistics efficiently</span>
        </div>
        <div className="flex flex-col items-center">
          <Star className="h-10 w-10 text-yellow-400 mb-2" />
          <span className="font-bold text-lg text-yellow-700">Admins</span>
          <span className="text-gray-500">Oversee, verify, and analyze the platform</span>
        </div>
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Our Vision</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          To create a transparent, efficient, and sustainable ecosystem for the biofuel and agricultural supply chain, empowering every participant with technology and trust.
        </p>
      </div>
    </div>
  </div>
);

export default About; 