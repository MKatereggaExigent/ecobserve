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
      category: 'Authentication',
      description: 'User authentication and account management (OAuth 2.0 / JWT)',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register a new user account',
          auth: 'Public',
          tier: 'All'
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Login and receive JWT access token',
          auth: 'Public',
          tier: 'All'
        },
        {
          method: 'POST',
          path: '/api/auth/refresh',
          description: 'Refresh JWT access token using refresh token',
          auth: 'Public',
          tier: 'All'
        },
        {
          method: 'POST',
          path: '/api/auth/logout',
          description: 'Logout and invalidate refresh token',
          auth: 'JWT Required',
          tier: 'All'
        },
        {
          method: 'GET',
          path: '/api/auth/me',
          description: 'Get current user profile and permissions (RBAC)',
          auth: 'JWT Required',
          tier: 'All'
        },
        {
          method: 'POST',
          path: '/api/auth/2fa/setup',
          description: 'Setup two-factor authentication',
          auth: 'JWT Required',
          tier: 'All'
        },
        {
          method: 'POST',
          path: '/api/auth/2fa/enable',
          description: 'Enable two-factor authentication',
          auth: 'JWT Required',
          tier: 'All'
        }
      ]
    },
    {
      category: 'Events',
      description: 'Manage events and carbon calculations (Multi-tenant, RBAC enforced)',
      endpoints: [
        {
          method: 'GET',
          path: '/api/events',
          description: 'List all events (filtered by organization_id, requires event:read permission)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/events',
          description: 'Create event (enforces subscription limits, requires event:create permission)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/events/:id',
          description: 'Get specific event (organization-scoped, requires event:read)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'PUT',
          path: '/api/events/:id',
          description: 'Update event (requires event:update permission)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'DELETE',
          path: '/api/events/:id',
          description: 'Delete event (requires event:delete permission)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/events/:id/carbon',
          description: 'Save carbon calculator data for event',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        }
      ]
    },
    {
      category: 'Organizations',
      description: 'Manage organization settings and members (Multi-tenant, RBAC enforced)',
      endpoints: [
        {
          method: 'GET',
          path: '/api/organizations/mine',
          description: 'List all organizations user belongs to',
          auth: 'JWT Required',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/organizations',
          description: 'Create a new organization',
          auth: 'JWT Required',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/organizations/current',
          description: 'Get current organization details (requires organization:read)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'PUT',
          path: '/api/organizations/current',
          description: 'Update current organization (requires organization:update)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/organizations/members',
          description: 'List organization members (requires organization:read)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/organizations/members',
          description: 'Add member to organization (requires organization:manage_members)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'DELETE',
          path: '/api/organizations/members/:userId',
          description: 'Remove member from organization (requires organization:manage_members)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        }
      ]
    },
    {
      category: 'Payments & Subscriptions',
      description: 'Payment processing and subscription management',
      endpoints: [
        {
          method: 'GET',
          path: '/api/payments/plans',
          description: 'Get all subscription plans (public)',
          auth: 'Public',
          tier: 'All'
        },
        {
          method: 'POST',
          path: '/api/payments/initialize',
          description: 'Initialize payment for subscription upgrade',
          auth: 'JWT Required',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/payments/verify/:reference',
          description: 'Verify payment status (requires payment:read)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/payments/subscription',
          description: 'Get current subscription details (requires payment:read)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/payments/transactions',
          description: 'Get payment transaction history (requires payment:read)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/payments/subscription/cancel',
          description: 'Cancel active subscription (requires payment:manage)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/payments/subscription/downgrade',
          description: 'Downgrade subscription tier (requires payment:manage)',
          auth: 'JWT + RBAC',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/subscription/usage',
          description: 'Get subscription usage and limits (organization-scoped)',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        }
      ]
    },
    {
      category: 'Statistics & Analytics',
      description: 'Platform statistics and analytics (Multi-tenant)',
      endpoints: [
        {
          method: 'GET',
          path: '/api/statistics',
          description: 'Get platform-wide public statistics',
          auth: 'Public',
          tier: 'All'
        },
        {
          method: 'POST',
          path: '/api/analytics/track',
          description: 'Track analytics event (organization-scoped)',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/analytics/conversion',
          description: 'Get conversion rate statistics (requires admin:access)',
          auth: 'JWT + RBAC (Admin)',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/analytics/logins',
          description: 'Get login analytics for organization',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        }
      ]
    },
    {
      category: 'User Settings',
      description: 'User preferences and settings',
      endpoints: [
        {
          method: 'GET',
          path: '/api/settings/currencies',
          description: 'Get all supported currencies (public)',
          auth: 'Public',
          tier: 'All'
        },
        {
          method: 'GET',
          path: '/api/settings/exchange-rate/:currency',
          description: 'Get exchange rate for currency (public)',
          auth: 'Public',
          tier: 'All'
        },
        {
          method: 'GET',
          path: '/api/settings',
          description: 'Get current user settings',
          auth: 'JWT Required',
          tier: 'All tiers'
        },
        {
          method: 'PUT',
          path: '/api/settings',
          description: 'Update current user settings',
          auth: 'JWT Required',
          tier: 'All tiers'
        }
      ]
    },
    {
      category: 'Planner Tier Features',
      description: 'AI recommendations, certificates, carbon offsets, suppliers (Requires Planner tier+)',
      endpoints: [
        {
          method: 'POST',
          path: '/api/planner/ai-recommendations',
          description: 'Generate AI-powered sustainability recommendations',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'POST',
          path: '/api/planner/certificate',
          description: 'Generate green score certificate for event',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/certificate/:eventId',
          description: 'Get existing certificate for event',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'POST',
          path: '/api/planner/tax-incentives',
          description: 'Calculate South African tax incentives for green events',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/tax-incentives/:eventId',
          description: 'Get tax incentive calculation for event',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/carbon-offsets',
          description: 'Get available carbon offset options',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'POST',
          path: '/api/planner/carbon-offsets/purchase',
          description: 'Purchase carbon offsets for event',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/carbon-offsets/event/:eventId',
          description: 'Get carbon offset purchases for event',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/carbon-offsets/organization',
          description: 'Get all organization carbon offset purchases',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/suppliers/search',
          description: 'Search for sustainable suppliers',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/suppliers/:category',
          description: 'Get suppliers by category',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'POST',
          path: '/api/planner/suppliers/event',
          description: 'Add supplier to event for carbon tracking',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'GET',
          path: '/api/planner/suppliers/event/:eventId',
          description: 'Get all suppliers for event',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        },
        {
          method: 'POST',
          path: '/api/planner/benchmarks/compare',
          description: 'Compare event against industry benchmarks',
          auth: 'JWT + Planner Tier',
          tier: 'Planner+'
        }
      ]
    },
    {
      category: 'Impact Leader Tier Features',
      description: 'Advanced analytics, AI chatbot, monitoring (Requires Impact Leader tier+)',
      endpoints: [
        {
          method: 'GET',
          path: '/api/impact-leader/dashboard',
          description: 'Get comprehensive impact dashboard with visual analytics',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'POST',
          path: '/api/impact-leader/research',
          description: 'Generate AI-powered industry research and benchmarking',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'POST',
          path: '/api/impact-leader/chat',
          description: 'Send message to AI sustainability chatbot (EcoBot)',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'GET',
          path: '/api/impact-leader/chat/history',
          description: 'Get chatbot conversation history',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'DELETE',
          path: '/api/impact-leader/chat',
          description: 'Clear chatbot conversation history',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'GET',
          path: '/api/impact-leader/chat/suggestions',
          description: 'Get suggested questions for chatbot',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'GET',
          path: '/api/impact-leader/monitor/:eventId',
          description: 'Monitor event and get real-time scorecard with alerts',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'POST',
          path: '/api/impact-leader/reports/generate',
          description: 'Generate executive sustainability report for board meetings',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'POST',
          path: '/api/impact-leader/badge/generate',
          description: 'Generate sustainability badge/certification for website',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'GET',
          path: '/api/impact-leader/badge/:badgeId/embed',
          description: 'Get embeddable HTML code for sustainability badge',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        },
        {
          method: 'GET',
          path: '/api/impact-leader/weather',
          description: 'Get weather data for event location planning',
          auth: 'JWT + Impact Tier',
          tier: 'Impact Leader+'
        }
      ]
    },
    {
      category: 'Enterprise Tier Features',
      description: 'Enterprise onboarding, feature requests, QBRs (Requires Enterprise tier)',
      endpoints: [
        {
          method: 'POST',
          path: '/api/enterprise/onboarding',
          description: 'Submit enterprise onboarding questionnaire',
          auth: 'JWT + Org Context',
          tier: 'Enterprise'
        },
        {
          method: 'GET',
          path: '/api/enterprise/onboarding/my',
          description: 'Get my organization\'s onboarding submission',
          auth: 'JWT + Org Context',
          tier: 'Enterprise'
        },
        {
          method: 'GET',
          path: '/api/enterprise/onboarding',
          description: 'Get all onboarding submissions (Admin only, requires admin:access)',
          auth: 'JWT + RBAC (Admin)',
          tier: 'Enterprise'
        },
        {
          method: 'POST',
          path: '/api/enterprise/feature-requests',
          description: 'Submit a feature request',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/enterprise/feature-requests',
          description: 'Get all feature requests',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/enterprise/feature-requests/:id/vote',
          description: 'Vote on a feature request',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        },
        {
          method: 'POST',
          path: '/api/enterprise/bug-reports',
          description: 'Submit a bug report',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/enterprise/bug-reports',
          description: 'Get bug reports (filtered by permission)',
          auth: 'JWT + Org Context',
          tier: 'All tiers'
        },
        {
          method: 'GET',
          path: '/api/enterprise/quarterly-reviews',
          description: 'Get quarterly business reviews for organization',
          auth: 'JWT + Org Context',
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

              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">🔐 Authentication Flow (OAuth 2.0 / JWT):</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>1. Login:</strong> POST to <code className="bg-white px-2 py-0.5 rounded">/api/auth/login</code> with email & password</p>
                  <p><strong>2. Receive:</strong> JWT access token (15min expiry) + refresh token</p>
                  <p><strong>3. Include:</strong> <code className="bg-white px-2 py-0.5 rounded">Authorization: Bearer {'{'}JWT_TOKEN{'}'}</code> in all requests</p>
                  <p><strong>4. Refresh:</strong> Use refresh token to get new access token when expired</p>
                  <p><strong>5. RBAC:</strong> JWT contains user permissions - backend validates against resource access</p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">🏢 Multi-Tenancy & Organization Scoping:</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• All data queries are automatically filtered by <code className="bg-white px-2 py-0.5 rounded">organization_id</code></p>
                  <p>• JWT contains user's organization context</p>
                  <p>• Users can only access data from their own organization</p>
                  <p>• Admin endpoints require <code className="bg-white px-2 py-0.5 rounded">admin:access</code> permission in JWT</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Example Request with JWT:</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`# Step 1: Login and get JWT token
curl -X POST https://ecobserve.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@company.com", "password": "***"}'

# Response:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "refreshToken": "...",
#   "user": {...},
#   "organization": {...}
# }

# Step 2: Use JWT token in subsequent requests
curl -X GET https://ecobserve.com/api/events \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json"

# Returns only events for user's organization (multi-tenant filtering)
# Requires 'event:read' permission in user's JWT (RBAC)`}
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
