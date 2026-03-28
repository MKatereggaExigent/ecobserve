import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Bug, ThumbsUp, Send, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';

type Tab = 'feature-requests' | 'bug-reports';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  vote_count?: number;
  created_at: string;
  user_name: string;
  requires_onpremise: boolean;
}

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  created_at: string;
  user_name: string;
}

const FeatureRequestsBugs: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('feature-requests');
  const [showForm, setShowForm] = useState(false);

  // Feature Request State
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [featureFormData, setFeatureFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    useCase: '',
    affectedUsers: 1,
    currentWorkaround: '',
    requiresOnpremise: false,
    technicalNotes: '',
  });

  // Bug Report State
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [bugFormData, setBugFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    category: 'other',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    browser: '',
    os: '',
    device: '',
    pageUrl: window.location.href,
    errorLogs: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'feature-requests') {
      fetchFeatureRequests();
    } else {
      fetchBugReports();
    }
  }, [activeTab]);

  useEffect(() => {
    // Auto-detect browser and OS
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
    else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

    if (userAgent.indexOf('Win') > -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') > -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
    else if (userAgent.indexOf('Android') > -1) os = 'Android';
    else if (userAgent.indexOf('iOS') > -1) os = 'iOS';

    setBugFormData((prev) => ({ ...prev, browser, os, device: navigator.platform }));
  }, []);

  const fetchFeatureRequests = async () => {
    try {
      const response = await fetch('/api/enterprise/feature-requests', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFeatureRequests(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch feature requests:', error);
    }
  };

  const fetchBugReports = async () => {
    try {
      const response = await fetch('/api/enterprise/bug-reports', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBugReports(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch bug reports:', error);
    }
  };

  const submitFeatureRequest = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/enterprise/feature-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(featureFormData),
      });

      if (response.ok) {
        alert('Feature request submitted successfully!');
        setShowForm(false);
        setFeatureFormData({
          title: '',
          description: '',
          category: 'other',
          useCase: '',
          affectedUsers: 1,
          currentWorkaround: '',
          requiresOnpremise: false,
          technicalNotes: '',
        });
        fetchFeatureRequests();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit feature request');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitBugReport = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/enterprise/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(bugFormData),
      });

      if (response.ok) {
        alert('Bug report submitted successfully!');
        setShowForm(false);
        setBugFormData({
          ...bugFormData,
          title: '',
          description: '',
          stepsToReproduce: '',
          expectedBehavior: '',
          actualBehavior: '',
          errorLogs: '',
        });
        fetchBugReports();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit bug report');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const voteFeatureRequest = async (id: string) => {
    try {
      const response = await fetch(`/api/enterprise/feature-requests/${id}/vote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        fetchFeatureRequests();
      }
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      submitted: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock },
      under_review: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Clock },
      planned: { bg: 'bg-purple-100', text: 'text-purple-600', icon: CheckCircle2 },
      in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle2 },
      open: { bg: 'bg-red-100', text: 'text-red-600', icon: AlertTriangle },
      resolved: { bg: 'bg-green-100', text: 'text-green-600', icon: CheckCircle2 },
    };

    const badge = badges[status] || badges.submitted;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-600',
      medium: 'bg-yellow-100 text-yellow-600',
      high: 'bg-orange-100 text-orange-600',
      critical: 'bg-red-100 text-red-600',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[severity] || colors.medium}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Feature Requests & Bug Reports</h1>
            <p className="text-xl text-gray-600">
              Help us improve EcobServe - request features or report bugs
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => { setActiveTab('feature-requests'); setShowForm(false); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'feature-requests'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              Feature Requests
            </button>
            <button
              onClick={() => { setActiveTab('bug-reports'); setShowForm(false); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'bug-reports'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bug className="w-5 h-5" />
              Bug Reports
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
              {showForm ? 'Cancel' : activeTab === 'feature-requests' ? 'Request Feature' : 'Report Bug'}
            </button>
          </div>

          {/* Feature Request Form */}
          {showForm && activeTab === 'feature-requests' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Submit Feature Request</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Feature Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={featureFormData.title}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., Export data to Power BI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={featureFormData.description}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Describe the feature in detail..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={featureFormData.category}
                      onChange={(e) => setFeatureFormData({ ...featureFormData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="analytics">Analytics</option>
                      <option value="reporting">Reporting</option>
                      <option value="integrations">Integrations</option>
                      <option value="sustainability">Sustainability</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Affected Users</label>
                    <input
                      type="number"
                      min="1"
                      value={featureFormData.affectedUsers}
                      onChange={(e) => setFeatureFormData({ ...featureFormData, affectedUsers: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Use Case <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={featureFormData.useCase}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, useCase: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Why do you need this feature? How will it help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Workaround</label>
                  <input
                    type="text"
                    value={featureFormData.currentWorkaround}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, currentWorkaround: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="What are you currently doing instead?"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requiresOnpremise"
                    checked={featureFormData.requiresOnpremise}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, requiresOnpremise: e.target.checked })}
                  />
                  <label htmlFor="requiresOnpremise" className="font-semibold text-gray-700">
                    This feature requires On-Premise deployment
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Technical Notes (Optional)</label>
                  <textarea
                    value={featureFormData.technicalNotes}
                    onChange={(e) => setFeatureFormData({ ...featureFormData, technicalNotes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Any technical requirements or constraints?"
                  />
                </div>

                <button
                  onClick={submitFeatureRequest}
                  disabled={isSubmitting || !featureFormData.title || !featureFormData.description || !featureFormData.useCase}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
                </button>
              </div>
            </div>
          )}

          {/* Bug Report Form */}
          {showForm && activeTab === 'bug-reports' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Report a Bug</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bug Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bugFormData.title}
                    onChange={(e) => setBugFormData({ ...bugFormData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="e.g., Export button not working"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bugFormData.description}
                    onChange={(e) => setBugFormData({ ...bugFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="Describe what happened..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
                    <select
                      value={bugFormData.severity}
                      onChange={(e) => setBugFormData({ ...bugFormData, severity: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={bugFormData.category}
                      onChange={(e) => setBugFormData({ ...bugFormData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="ui">UI/UX</option>
                      <option value="api">API</option>
                      <option value="performance">Performance</option>
                      <option value="data">Data</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Steps to Reproduce <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bugFormData.stepsToReproduce}
                    onChange={(e) => setBugFormData({ ...bugFormData, stepsToReproduce: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    placeholder="1. Go to...\n2. Click on...\n3. See error"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Behavior</label>
                    <textarea
                      value={bugFormData.expectedBehavior}
                      onChange={(e) => setBugFormData({ ...bugFormData, expectedBehavior: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="What should happen?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Actual Behavior</label>
                    <textarea
                      value={bugFormData.actualBehavior}
                      onChange={(e) => setBugFormData({ ...bugFormData, actualBehavior: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="What actually happened?"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Browser</label>
                    <input
                      type="text"
                      value={bugFormData.browser}
                      onChange={(e) => setBugFormData({ ...bugFormData, browser: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="Auto-detected"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Operating System</label>
                    <input
                      type="text"
                      value={bugFormData.os}
                      onChange={(e) => setBugFormData({ ...bugFormData, os: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="Auto-detected"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Device</label>
                    <input
                      type="text"
                      value={bugFormData.device}
                      onChange={(e) => setBugFormData({ ...bugFormData, device: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="Auto-detected"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Error Logs (Optional)</label>
                  <textarea
                    value={bugFormData.errorLogs}
                    onChange={(e) => setBugFormData({ ...bugFormData, errorLogs: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none font-mono text-sm"
                    placeholder="Paste any error messages from the console..."
                  />
                </div>

                <button
                  onClick={submitBugReport}
                  disabled={isSubmitting || !bugFormData.title || !bugFormData.description || !bugFormData.stepsToReproduce}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                </button>
              </div>
            </div>
          )}

          {/* Feature Requests List */}
          {activeTab === 'feature-requests' && !showForm && (
            <div className="space-y-4">
              {featureRequests.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No feature requests yet. Be the first to request one!</p>
                </div>
              ) : (
                featureRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{request.title}</h3>
                          {request.requires_onpremise && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-semibold">
                              On-Premise
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="px-3 py-1 bg-gray-100 rounded-full">{request.category}</span>
                          <span>{getStatusBadge(request.status)}</span>
                          <span>by {request.user_name}</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => voteFeatureRequest(request.id)}
                        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                      >
                        <ThumbsUp className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-600">
                          {request.vote_count || request.votes || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Bug Reports List */}
          {activeTab === 'bug-reports' && !showForm && (
            <div className="space-y-4">
              {bugReports.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No bug reports yet. Report one if you find an issue!</p>
                </div>
              ) : (
                bugReports.map((bug) => (
                  <div key={bug.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{bug.title}</h3>
                          {getSeverityBadge(bug.severity)}
                        </div>
                        <p className="text-gray-600 mb-3">{bug.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{getStatusBadge(bug.status)}</span>
                          <span>by {bug.user_name}</span>
                          <span>{new Date(bug.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default FeatureRequestsBugs;

