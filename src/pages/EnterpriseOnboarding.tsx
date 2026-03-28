import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Target, Settings, Calendar, Mail, Phone, CheckCircle } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';

const EnterpriseOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Company Information
    companySize: '',
    industry: '',
    currentTools: [] as string[],

    // Requirements & Goals
    primaryGoals: [] as string[],
    expectedEventsPerYear: '',
    teamSize: '',
    locations: '1',

    // Technical Requirements
    requiresApi: false,
    requiresOnpremise: false,
    requiresSso: false,
    requiresCustomBranding: false,
    integrationNeeds: [] as string[],

    // Compliance & Reporting
    complianceStandards: [] as string[],
    reportingFrequency: '',
    customRequirements: '',

    // Timeline & Budget
    expectedStartDate: '',
    budgetRange: '',
    decisionTimeline: '',

    // Contact
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    preferredContactMethod: 'email',
  });

  const companySizeOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const industryOptions = [
    'Events & Conferences',
    'Hospitality',
    'Corporate',
    'Government',
    'Non-profit',
    'Education',
    'Other',
  ];
  const goalOptions = [
    'Reduce carbon footprint',
    'Compliance reporting',
    'Sustainability certification',
    'Cost savings',
    'Brand reputation',
    'Stakeholder transparency',
  ];
  const integrationOptions = [
    'Event management software',
    'CRM (Salesforce, HubSpot)',
    'Accounting software',
    'Reporting tools (Power BI, Tableau)',
    'Custom internal systems',
  ];
  const complianceOptions = ['ISO 14001', 'GRI Standards', 'CDP', 'TCFD', 'SASB', 'Custom'];

  const totalSteps = 5;

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => {
      const array = prev[field as keyof typeof prev] as string[];
      const newArray = array.includes(value)
        ? array.filter((item) => item !== value)
        : [...array, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/enterprise/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          expectedEventsPerYear: parseInt(formData.expectedEventsPerYear) || 0,
          teamSize: parseInt(formData.teamSize) || 0,
          locations: parseInt(formData.locations) || 1,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.companySize && formData.industry;
      case 2:
        return formData.primaryGoals.length > 0 && formData.expectedEventsPerYear && formData.teamSize;
      case 3:
        return true; // Technical requirements are optional
      case 4:
        return formData.reportingFrequency;
      case 5:
        return formData.primaryContactName && formData.primaryContactEmail;
      default:
        return true;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <Navbar onNavigate={(section) => navigate(`/#${section}`)} />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your enterprise onboarding questionnaire has been submitted successfully.
            </p>
            <p className="text-gray-600 mb-8">
              Our enterprise sales team will review your requirements and contact you within 24 hours at{' '}
              <strong>{formData.primaryContactEmail}</strong>.
            </p>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Back to Pricing
            </button>
          </div>
        </div>
        
        <Footer onNavigate={(section) => navigate(`/#${section}`)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Enterprise Onboarding</h1>
            <p className="text-xl text-gray-600">
              Help us understand your organization's sustainability needs
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step <= currentStep
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold">Company Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {companySizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleChange('companySize', size)}
                          className={`px-4 py-3 rounded-xl border-2 transition-all ${
                            formData.companySize === size
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-200'
                          }`}
                        >
                          {size} employees
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="">Select your industry</option>
                      {industryOptions.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Current Tools */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Tools/Software (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.currentTools.join(', ')}
                      onChange={(e) =>
                        handleChange(
                          'currentTools',
                          e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        )
                      }
                      placeholder="e.g., Excel, Cvent, Salesforce"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate multiple tools with commas</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Requirements & Goals */}
            {currentStep === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold">Requirements & Goals</h2>
                </div>

                <div className="space-y-6">
                  {/* Primary Goals */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Sustainability Goals <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {goalOptions.map((goal) => (
                        <label
                          key={goal}
                          className={`px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.primaryGoals.includes(goal)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.primaryGoals.includes(goal)}
                            onChange={() => handleArrayToggle('primaryGoals', goal)}
                            className="mr-2"
                          />
                          {goal}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Expected Events Per Year */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expected Events Per Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.expectedEventsPerYear}
                      onChange={(e) => handleChange('expectedEventsPerYear', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="e.g., 50"
                    />
                  </div>

                  {/* Team Size & Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Team Size <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.teamSize}
                        onChange={(e) => handleChange('teamSize', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                        placeholder="Number of users"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Number of Locations
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.locations}
                        onChange={(e) => handleChange('locations', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Technical Requirements */}
            {currentStep === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold">Technical Requirements</h2>
                </div>

                <div className="space-y-6">
                  {/* Technical Features */}
                  <div className="space-y-4">
                    {[
                      { key: 'requiresApi', label: 'API Integration', desc: 'REST API access for custom integrations' },
                      { key: 'requiresOnpremise', label: 'On-Premise Deployment', desc: 'Host on your own infrastructure' },
                      { key: 'requiresSso', label: 'Single Sign-On (SSO)', desc: 'SAML 2.0 or OAuth integration' },
                      { key: 'requiresCustomBranding', label: 'Custom Branding', desc: 'White-label the platform' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-200 cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={formData[item.key as keyof typeof formData] as boolean}
                          onChange={(e) => handleChange(item.key, e.target.checked)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Integration Needs */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Integration Needs (Optional)
                    </label>
                    <div className="space-y-2">
                      {integrationOptions.map((integration) => (
                        <label
                          key={integration}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.integrationNeeds.includes(integration)}
                            onChange={() => handleArrayToggle('integrationNeeds', integration)}
                          />
                          <span>{integration}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Compliance & Reporting */}
            {currentStep === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold">Compliance & Reporting</h2>
                </div>

                <div className="space-y-6">
                  {/* Compliance Standards */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Compliance Standards (Optional)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {complianceOptions.map((standard) => (
                        <label
                          key={standard}
                          className={`px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                            formData.complianceStandards.includes(standard)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.complianceStandards.includes(standard)}
                            onChange={() => handleArrayToggle('complianceStandards', standard)}
                            className="mr-2"
                          />
                          {standard}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Reporting Frequency */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reporting Frequency <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Monthly', 'Quarterly', 'Annually'].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => handleChange('reportingFrequency', freq.toLowerCase())}
                          className={`px-4 py-3 rounded-xl border-2 transition-all ${
                            formData.reportingFrequency === freq.toLowerCase()
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-200'
                          }`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Requirements */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Custom Requirements or Notes (Optional)
                    </label>
                    <textarea
                      value={formData.customRequirements}
                      onChange={(e) => handleChange('customRequirements', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="Any specific requirements or questions?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Contact & Timeline */}
            {currentStep === 5 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold">Contact & Timeline</h2>
                </div>

                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Primary Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.primaryContactName}
                      onChange={(e) => handleChange('primaryContactName', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.primaryContactEmail}
                        onChange={(e) => handleChange('primaryContactEmail', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.primaryContactPhone}
                        onChange={(e) => handleChange('primaryContactPhone', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expected Start Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.expectedStartDate}
                        onChange={(e) => handleChange('expectedStartDate', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Decision Timeline (Optional)
                      </label>
                      <select
                        value={formData.decisionTimeline}
                        onChange={(e) => handleChange('decisionTimeline', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="">Select timeframe</option>
                        <option value="immediate">Immediate</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="6+ months">6+ months</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget Range (Optional)
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => handleChange('budgetRange', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="">Select budget range</option>
                      <option value="<R10k/month">&lt; R10,000/month</option>
                      <option value="R10k-R50k/month">R10,000 - R50,000/month</option>
                      <option value="R50k-R100k/month">R50,000 - R100,000/month</option>
                      <option value=">R100k/month">&gt; R100,000/month</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  isStepValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default EnterpriseOnboarding;

