import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, GraduationCap, LineChart } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100">
          <Sparkles size={16} /> Powering the future of hiring
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          Intelligent Campus Placements
        </h1>
        <p className="text-xl text-gray-500 mb-10 leading-relaxed">
          Connect talented students with top recruiters effortlessly. Experience the power of AI-driven shortlisting to streamline the hiring process.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-blue-200 transition transform hover:-translate-y-1">
            Get Started Now
          </Link>
          <Link to="/login" className="bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 font-bold py-4 px-8 rounded-full transition">
            Login to Account
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-left">
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition">
            <GraduationCap className="text-blue-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">For Students</h3>
            <p className="text-gray-500 text-sm">Build AI-enhanced profiles and apply to top companies with one click.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition">
            <Briefcase className="text-indigo-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">For Recruiters</h3>
            <p className="text-gray-500 text-sm">Post jobs and utilize OpenAI logic to instantly shortlist candidates based on skills.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition">
            <LineChart className="text-purple-500 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">For TPOs</h3>
            <p className="text-gray-500 text-sm">Gain powerful analytics and insights into placement trends across all branches.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
