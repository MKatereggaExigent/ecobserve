import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, TrendingUp, Calendar, User, ExternalLink, Zap, Wind, Sun, Droplets, Factory, Car, Recycle, Utensils, Bot, Music } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  source?: string;
  sourceUrl?: string;
  icon?: any;
  externalUrl?: string;
}

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [carbonData, setCarbonData] = useState<any>(null);
  const [renewableData, setRenewableData] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All Articles', icon: Leaf },
    { id: 'green-energy', label: 'Green Energy', icon: Zap },
    { id: 'sustainability', label: 'Sustainability', icon: TrendingUp },
    { id: 'climate', label: 'Climate', icon: Wind },
    { id: 'renewable', label: 'Renewable Energy', icon: Sun },
  ];

  useEffect(() => {
    fetchRealWorldData();
  }, []);

  const fetchRealWorldData = async () => {
    try {
      setLoading(true);

      // Try to fetch CO2 emissions data from public APIs
      // Note: Most require API keys, so we'll show static educational data for now
      // Users can click through to the external sources for real-time data
      try {
        const response = await fetch('https://api.electricitymap.org/health');
        if (response.ok) {
          // API is available - in production, you would fetch real data with an API key
          setCarbonData({
            note: 'Live data available at Electricity Maps',
            url: 'https://www.electricitymaps.com/'
          });
        }
      } catch (error) {
        // API unavailable - that's okay, we link to external sources instead
        console.log('External API unavailable - using direct links to data sources');
      }

      // Generate blog posts from real sustainability data sources
      const generatedPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Global Renewable Energy Statistics & Data',
          excerpt: 'IRENA provides comprehensive statistics on renewable energy capacity, generation, and investment worldwide. Access real-time data on solar, wind, hydro, and other renewable sources.',
          content: 'The International Renewable Energy Agency (IRENA) maintains the most comprehensive renewable energy statistics database...',
          category: 'renewable',
          date: new Date().toISOString(),
          author: 'IRENA',
          readTime: '5 min read',
          source: 'International Renewable Energy Agency',
          externalUrl: 'https://www.irena.org/Data',
          icon: Sun
        },
        {
          id: '2',
          title: 'Live Global Carbon Emissions Data',
          excerpt: 'Real-time CO2 emissions data from electricity consumption worldwide. Track carbon intensity by country and understand the environmental impact of energy use.',
          content: 'The CO2 Signal provides real-time carbon intensity data...',
          category: 'climate',
          date: new Date(Date.now() - 86400000).toISOString(),
          author: 'Electricity Maps',
          readTime: '3 min read',
          source: 'CO2 Signal API',
          externalUrl: 'https://www.electricitymaps.com/',
          icon: Factory
        },
        {
          id: '3',
          title: 'UN Sustainable Development Goals Progress Tracker',
          excerpt: 'Track global progress on the 17 UN Sustainable Development Goals with real-time data, indicators, and country-specific achievements.',
          content: 'The United Nations provides comprehensive SDG tracking...',
          category: 'sustainability',
          date: new Date(Date.now() - 172800000).toISOString(),
          author: 'United Nations',
          readTime: '6 min read',
          source: 'UN SDG Database',
          externalUrl: 'https://unstats.un.org/sdgs/dataportal',
          icon: TrendingUp
        },
        {
          id: '4',
          title: 'World Air Quality Index - Real-Time Pollution Data',
          excerpt: 'Access real-time air quality data from over 100 countries. Monitor PM2.5, PM10, ozone, and other pollutants affecting global health and climate.',
          content: 'The World Air Quality Index provides comprehensive pollution monitoring...',
          category: 'climate',
          date: new Date(Date.now() - 259200000).toISOString(),
          author: 'World Air Quality Index',
          readTime: '4 min read',
          source: 'WAQI Open Data Platform',
          externalUrl: 'https://aqicn.org/data-platform/covid19/',
          icon: Wind
        },
        {
          id: '5',
          title: 'Open Climate Data from World Bank',
          excerpt: 'Comprehensive climate data including temperature trends, precipitation patterns, sea level rise, and greenhouse gas emissions from the World Bank.',
          content: 'The World Bank Climate Change Knowledge Portal offers extensive datasets...',
          category: 'climate',
          date: new Date(Date.now() - 345600000).toISOString(),
          author: 'World Bank Group',
          readTime: '5 min read',
          source: 'World Bank Climate Data API',
          externalUrl: 'https://datahelpdesk.worldbank.org/knowledgebase/articles/902061-climate-data-api',
          icon: TrendingUp
        },
        {
          id: '6',
          title: 'Global Forest Watch - Deforestation Monitoring',
          excerpt: 'Monitor global forests in near real-time using satellite data. Track deforestation, forest fires, and reforestation efforts worldwide.',
          content: 'Global Forest Watch uses satellite technology to monitor forests...',
          category: 'sustainability',
          date: new Date(Date.now() - 432000000).toISOString(),
          author: 'World Resources Institute',
          readTime: '5 min read',
          source: 'Global Forest Watch',
          externalUrl: 'https://www.globalforestwatch.org/',
          icon: Leaf
        },
        {
          id: '7',
          title: 'Open Energy Data from IEA',
          excerpt: 'International Energy Agency provides free access to key energy statistics including consumption, production, prices, and renewable energy trends.',
          content: 'The IEA maintains the world\'s most comprehensive energy database...',
          category: 'green-energy',
          date: new Date(Date.now() - 518400000).toISOString(),
          author: 'International Energy Agency',
          readTime: '4 min read',
          source: 'IEA Open Data',
          externalUrl: 'https://www.iea.org/data-and-statistics',
          icon: Zap
        },
        {
          id: '8',
          title: 'NASA Climate Change Data & Visualizations',
          excerpt: 'NASA provides open-access climate data including global temperature records, ice sheet measurements, sea level data, and atmospheric CO2 levels.',
          content: 'NASA\'s climate data portal offers decades of satellite observations...',
          category: 'climate',
          date: new Date(Date.now() - 604800000).toISOString(),
          author: 'NASA',
          readTime: '6 min read',
          source: 'NASA Climate Data',
          externalUrl: 'https://climate.nasa.gov/vital-signs/',
          icon: Sun
        },
      ];

      setPosts(generatedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} activeSection="" />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Sustainability Insights
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Latest trends, research, and real-world data on green energy, eco-friendly practices, and sustainable event management
            </p>
          </div>

          {/* Information Banner */}
          <div className="mb-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Open-Source Environmental Data
                </h3>
                <p className="text-gray-700 mb-3">
                  All articles link to real, open-source environmental data from trusted organizations including NASA, UN, World Bank, and leading research institutions. Click any card to access live data, statistics, and research.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-emerald-700 border border-emerald-200">
                    Real-Time Data
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-emerald-700 border border-emerald-200">
                    Open Source
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-emerald-700 border border-emerald-200">
                    Verified Sources
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-emerald-700 border border-emerald-200">
                    Free Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading sustainability insights...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => {
                const IconComponent = post.icon || Leaf;
                return (
                  <article
                    key={post.id}
                    onClick={() => post.externalUrl && window.open(post.externalUrl, '_blank')}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
                  >
                    {/* Icon Header */}
                    <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <IconComponent className="w-24 h-24 text-white" strokeWidth={1.5} />
                    </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {categories.find(c => c.id === post.category)?.label || post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {post.externalUrl && (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium mt-2 pt-2 border-t border-gray-100">
                        <ExternalLink className="w-3 h-3" />
                        <span>Visit {post.source || 'source'} →</span>
                      </div>
                    )}

                    {post.source && !post.externalUrl && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-2 pt-2 border-t border-gray-100">
                        <span>Source: {post.source}</span>
                      </div>
                    )}
                  </div>
                </article>
              );
              })}
            </div>
          )}

          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found in this category.</p>
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default Blog;
