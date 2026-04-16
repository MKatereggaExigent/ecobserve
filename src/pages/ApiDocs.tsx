import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Lock, Key, Book, Zap, Shield, Copy, Check, ExternalLink } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';
import { useAuth } from '../contexts/AuthContext';

const ApiDocs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyGenerator, setShowKeyGenerator] = useState(false);

  const isEnterprise = user?.organization?.subscriptionTier === 'enterprise';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const generateApiKey = async () => {
    // TODO: Call backend API to generate key
    const mockKey = `ek_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(mockKey);
    setShowKeyGenerator(true);
  };

  const apiEndpoints = [
    {
      category: 'Events',
      description: 'Manage events and carbon calculations',
      endpoints: [
        {
          method: 'GET',
          path: '/api/events',
          description: 'List all events for your organization',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'POST',
          path: '/api/events',
          description: 'Create a new event',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'GET',
          path: '/api/events/:id',
          description: 'Get a specific event by ID',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'PUT',
          path: '/api/events/:id',
          description: 'Update an event',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'POST',
          path: '/api/events/:id/carbon',
          description: 'Save carbon calculation data for an event',
          auth: 'Required',
          tier: 'Enterprise'
        }
      ]
    },
    {
      category: 'Analytics',
      description: 'Access analytics and reporting data',
      endpoints: [
        {
          method: 'GET',
          path: '/api/statistics',
          description: 'Get organization-wide statistics and KPIs',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'GET',
          path: '/api/analytics/conversion',
          description: 'Get conversion rate statistics',
          auth: 'Required',
          tier: 'Enterprise'
        }
      ]
    },
    {
      category: 'Organizations',
      description: 'Manage organization settings and members',
      endpoints: [
        {
          method: 'GET',
          path: '/api/organizations/:id',
          description: 'Get organization details',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'PUT',
          path: '/api/organizations/:id',
          description: 'Update organization settings',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'GET',
          path: '/api/organizations/:id/members',
          description: 'List organization members',
          auth: 'Required',
          tier: 'Enterprise'
        }
      ]
    },
    {
      category: 'Subscription',
      description: 'Check subscription usage and limits',
      endpoints: [
        {
          method: 'GET',
          path: '/api/subscription/usage',
          description: 'Get current subscription usage statistics',
          auth: 'Required',
          tier: 'Enterprise'
        }
      ]
    },
    {
      category: 'Planner Features',
      description: 'AI recommendations and carbon offsets (Planner tier+)',
      endpoints: [
        {
          method: 'POST',
          path: '/api/planner/ai-recommendations',
          description: 'Generate AI-powered sustainability recommendations',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'GET',
          path: '/api/planner/carbon-offsets',
          description: 'Get available carbon offset options',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'POST',
          path: '/api/planner/certificate',
          description: 'Generate green score certificate',
          auth: 'Required',
          tier: 'Enterprise'
        }
      ]
    },
    {
      category: 'Impact Leader Features',
      description: 'Advanced analytics and AI chatbot (Impact tier+)',
      endpoints: [
        {
          method: 'GET',
          path: '/api/impact-leader/dashboard',
          description: 'Get comprehensive impact dashboard with visual analytics',
          auth: 'Required',
          tier: 'Enterprise'
        },
        {
          method: 'POST',
          path: '/api/impact-leader/research',
          description: 'Generate AI-powered industry research and benchmarking',
          auth: 'Required',
          tier: 'Enterprise'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} activeSection="" />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Programmatic access to EcobServe's sustainability data and features
            </p>
          </div>

          {/* Enterprise Access Notice */}
          {!isEnterprise && (
            <div className="mb-12 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Enterprise Tier Required
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    API access is exclusively available to Enterprise tier customers. Upgrade your subscription to access our comprehensive API and integrate EcobServe's sustainability tracking into your own systems.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => navigate('/pricing')}
                      className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Upgrade to Enterprise
                    </button>
                    <a
                      href="mailto:sales@ecobserve.com"
                      className="px-6 py-3 bg-white text-amber-700 border-2 border-amber-300 rounded-xl font-semibold hover:bg-amber-50 transition-colors inline-flex items-center gap-2"
                    >
                      Contact Sales
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Key Section (Enterprise Only) */}
          {isEnterprise && (
            <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-indigo-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <Key className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    API Authentication
                  </h2>
                  <p className="text-gray-600 mb-4">
                    All API requests must include your API key in the Authorization header. Keep your API keys secure and never commit them to version control.
                  </p>

                  {!showKeyGenerator && !apiKey && (
                    <button
                      onClick={generateApiKey}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                    >
                      <Key className="w-5 h-5" />
                      Generate API Key
                    </button>
                  )}

                  {apiKey && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Your API Key:</span>
                        <button
                          onClick={() => copyToClipboard(apiKey, 'api-key')}
                          className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 text-sm"
                        >
                          {copiedEndpoint === 'api-key' ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <code className="text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded border border-gray-200 block break-all">
                        {apiKey}
                      </code>
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                          <p className="text-xs text-amber-800">
                            <strong>Important:</strong> Store this key securely. For security reasons, we won't show it again. If you lose it, you'll need to generate a new one.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Example Request:</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X GET https://ecobserve.com/api/events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <a
              href="https://ecobserve.com/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Interactive API Docs
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                Explore and test API endpoints with our Swagger UI documentation
              </p>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                <ExternalLink className="w-4 h-4" />
                <span>Open Swagger Docs →</span>
              </div>
            </a>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-4">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rate Limits
              </h3>
              <p className="text-gray-600 text-sm">
                Enterprise: 10,000 requests/hour<br />
                Standard endpoints: 1000 requests/hour
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Security
              </h3>
              <p className="text-gray-600 text-sm">
                All API requests use HTTPS encryption and require authentication via API keys
              </p>
            </div>
          </div>

          {/* API Endpoints by Category */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Endpoints</h2>

            {apiEndpoints.map((category, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.category}</h3>
                  <p className="text-indigo-50">{category.description}</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.endpoints.map((endpoint, endpointIdx) => (
                      <div
                        key={endpointIdx}
                        className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                endpoint.method === 'GET'
                                  ? 'bg-blue-100 text-blue-700'
                                  : endpoint.method === 'POST'
                                  ? 'bg-green-100 text-green-700'
                                  : endpoint.method === 'PUT'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                          </div>
                          <button
                            onClick={() => copyToClipboard(endpoint.path, `endpoint-${idx}-${endpointIdx}`)}
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            {copiedEndpoint === `endpoint-${idx}-${endpointIdx}` ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{endpoint.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-500">
                            <strong>Auth:</strong> {endpoint.auth}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {endpoint.tier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Support */}
          <div className="mt-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-xl text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-indigo-50 mb-6 max-w-2xl mx-auto">
              Our technical team is here to help you integrate EcobServe's API into your systems. Reach out with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@ecobserve.com"
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="px-6 py-3 bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-800 transition-colors border-2 border-indigo-400"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default ApiDocs;
