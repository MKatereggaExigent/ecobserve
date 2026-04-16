import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, Mail, Users, TrendingUp, Globe, Zap } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';

const Partners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} activeSection="" />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Partnership Opportunities
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us in building the future of sustainable event management
            </p>
          </div>

          {/* Current Status */}
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Building Our Partner Network
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  We're currently in the early stages of building EcobServe and are exploring strategic partnerships that align with our mission of making events more sustainable.
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  At this time, we don't have formal partnerships in place, but we're actively looking to collaborate with organizations that share our values and vision for a more sustainable future.
                </p>
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Interested in partnering with us?</p>
                    <a href="mailto:partnerships@ecobserve.com" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                      partnerships@ecobserve.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Types We're Interested In */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Partnership Types We're Exploring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technology Partners</h3>
                <p className="text-gray-600 text-sm">
                  Providers of complementary technologies, APIs, and platforms that enhance our sustainability measurement capabilities.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-4">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainability Organizations</h3>
                <p className="text-gray-600 text-sm">
                  NGOs, certification bodies, and environmental organizations focused on climate action and carbon reduction.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Event Industry Partners</h3>
                <p className="text-gray-600 text-sm">
                  Venue operators, event management companies, and industry associations committed to sustainable practices.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-4">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Carbon Offset Providers</h3>
                <p className="text-gray-600 text-sm">
                  Verified carbon credit providers and offset programs that help events achieve carbon neutrality.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Research Institutions</h3>
                <p className="text-gray-600 text-sm">
                  Universities and research organizations working on sustainability metrics and environmental impact analysis.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-4">
                  <Handshake className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Service Providers</h3>
                <p className="text-gray-600 text-sm">
                  Sustainable suppliers, green energy providers, and eco-friendly product manufacturers.
                </p>
              </div>
            </div>
          </div>

          {/* Partnership Benefits */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-xl text-white mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Partner with EcobServe?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">🌍 Shared Mission</h3>
                <p className="text-emerald-50">Collaborate on meaningful climate action and sustainable event management initiatives.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🚀 Growing Platform</h3>
                <p className="text-emerald-50">Be part of an innovative platform serving event organizers worldwide.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">💼 Business Opportunities</h3>
                <p className="text-emerald-50">Access new markets and collaborate on joint solutions for sustainable events.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🤝 Strategic Collaboration</h3>
                <p className="text-emerald-50">Work together on product development, research, and market expansion.</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's Build Together</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If your organization is interested in exploring partnership opportunities with EcobServe, we'd love to hear from you. Reach out to discuss how we can collaborate on creating a more sustainable future for events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:partnerships@ecobserve.com"
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                partnerships@ecobserve.com
              </a>
              <span className="text-gray-400">or</span>
              <a
                href="tel:+27690448010"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                +27 (069) 044 8010
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default Partners;
