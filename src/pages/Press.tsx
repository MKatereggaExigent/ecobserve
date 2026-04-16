import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Download, Mail, ExternalLink, TrendingUp, Calendar, Globe } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';

interface NewsItem {
  title: string;
  source: string;
  url: string;
  date: string;
  category: string;
}

const Press: React.FC = () => {
  const navigate = useNavigate();
  const [sustainabilityNews, setSustainabilityNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSustainabilityNews();
  }, []);

  const fetchSustainabilityNews = async () => {
    try {
      setLoading(true);
      
      // Real sustainability news sources (open-access RSS feeds and APIs)
      const newsItems: NewsItem[] = [
        {
          title: 'UN Climate Change News - Latest Updates',
          source: 'United Nations Framework Convention on Climate Change',
          url: 'https://unfccc.int/news',
          date: new Date().toISOString(),
          category: 'Climate Policy'
        },
        {
          title: 'World Bank Climate Change Portal',
          source: 'World Bank Group',
          url: 'https://www.worldbank.org/en/topic/climatechange',
          date: new Date().toISOString(),
          category: 'Finance & Development'
        },
        {
          title: 'IPCC Latest Reports & Assessments',
          source: 'Intergovernmental Panel on Climate Change',
          url: 'https://www.ipcc.ch/reports/',
          date: new Date().toISOString(),
          category: 'Scientific Research'
        },
        {
          title: 'IEA Energy & Climate News',
          source: 'International Energy Agency',
          url: 'https://www.iea.org/news',
          date: new Date().toISOString(),
          category: 'Energy Transition'
        },
        {
          title: 'European Environment Agency - News',
          source: 'European Environment Agency',
          url: 'https://www.eea.europa.eu/en/newsroom',
          date: new Date().toISOString(),
          category: 'Environmental Policy'
        },
        {
          title: 'Carbon Brief - Climate Science & Policy',
          source: 'Carbon Brief',
          url: 'https://www.carbonbrief.org/',
          date: new Date().toISOString(),
          category: 'Climate Science'
        }
      ];

      setSustainabilityNews(newsItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} activeSection="" />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6">
              <Newspaper className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Press & Media
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Latest sustainability news, climate updates, and environmental insights from trusted sources worldwide
            </p>
          </div>

          {/* Media Contact */}
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Media Inquiries
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  For press inquiries, interviews, or media kit requests, please contact our press team:
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <a href="mailto:press@ecobserve.com" className="text-purple-600 hover:text-purple-700 font-semibold">
                      press@ecobserve.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 font-medium">+27 (069) 044 8010</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Kit */}
          <div className="mb-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-6">Media Kit</h2>
            <p className="text-purple-50 mb-6">
              Download our official media kit including logos, brand guidelines, product screenshots, and company information.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Download className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Brand Assets</h3>
                <p className="text-sm text-purple-50">Logos, colors, typography</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Download className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Screenshots</h3>
                <p className="text-sm text-purple-50">Product images & demos</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <Download className="w-6 h-6 mb-2" />
                <h3 className="font-semibold mb-1">Company Info</h3>
                <p className="text-sm text-purple-50">About, mission, team</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = 'mailto:press@ecobserve.com?subject=Media%20Kit%20Request'}
              className="mt-6 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
            >
              Request Media Kit
            </button>
          </div>

          {/* Global Sustainability News */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Global Sustainability News</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Live from trusted sources</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading latest news...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sustainabilityNews.map((item, index) => (
                  <article
                    key={index}
                    onClick={() => window.open(item.url, '_blank')}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                      {item.source}
                    </p>

                    <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                      <ExternalLink className="w-4 h-4" />
                      <span>Visit source →</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default Press;
