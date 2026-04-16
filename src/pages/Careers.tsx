import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Heart, Globe, TrendingUp, Mail, Bell } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';

const Careers: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} activeSection="" />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Join Our Mission
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help us build the future of sustainable events and make a real impact on climate change
            </p>
          </div>

          {/* Current Status Banner */}
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Currently Not Hiring
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Thank you for your interest in joining EcobServe! We're currently focusing on building our core platform and are not actively recruiting at this time.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  However, we're always interested in connecting with talented individuals who are passionate about sustainability and technology. If you'd like to be notified when we start hiring, please send your CV and a brief introduction to:
                </p>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a href="mailto:careers@ecobserve.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                    careers@ecobserve.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Company Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-4">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mission-Driven</h3>
                <p className="text-gray-600">
                  We're committed to making a real impact on climate change through sustainable event management and measurable carbon reduction.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Global Impact</h3>
                <p className="text-gray-600">
                  Based in Cape Town, South Africa, we're building solutions that help event organizers worldwide reduce their environmental footprint.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation First</h3>
                <p className="text-gray-600">
                  We combine cutting-edge technology with environmental science to create powerful tools for sustainability measurement and reporting.
                </p>
              </div>
            </div>
          </div>

          {/* Why EcobServe */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-xl text-white mb-12">
            <h2 className="text-3xl font-bold mb-6">Why EcobServe?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🌍 Meaningful Work</h3>
                <p className="text-emerald-50">Contribute to real climate action and help organizations measure and reduce their carbon footprint.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🚀 Growth Opportunity</h3>
                <p className="text-emerald-50">Be part of a growing startup in the sustainability tech space with room for professional development.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">💡 Innovation Culture</h3>
                <p className="text-emerald-50">Work with modern technologies and contribute to product decisions that shape the platform's future.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🌱 Sustainability Focus</h3>
                <p className="text-emerald-50">Join a company that practices what it preaches and leads by example in environmental responsibility.</p>
              </div>
            </div>
          </div>

          {/* Future Roles */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Roles We May Recruit For (In The Future)</h2>
            <p className="text-gray-600 mb-6">
              When we begin hiring, we'll be looking for passionate individuals in areas such as:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">💻</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Software Engineering</h4>
                  <p className="text-sm text-gray-600">Full-stack, Frontend, Backend, DevOps</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">🌿</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Sustainability Science</h4>
                  <p className="text-sm text-gray-600">Carbon accounting, Environmental analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">📊</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Product & Design</h4>
                  <p className="text-sm text-gray-600">Product management, UX/UI design</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">📈</span>
                <div>
                  <h4 className="font-semibold text-gray-900">Business Development</h4>
                  <p className="text-sm text-gray-600">Sales, Partnerships, Customer success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default Careers;
