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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 text-center">
              <div className="mb-6 sm:mb-8 animate-bounce">
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mx-auto" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Thank You!
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
                Your enterprise onboarding questionnaire has been submitted successfully.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-gray-700">
                  Our enterprise sales team will review your requirements and contact you within <strong className="text-emerald-700">24 hours</strong> at{' '}
                  <strong className="text-emerald-700 break-all">{formData.primaryContactEmail}</strong>.
                </p>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transition-all transform hover:scale-105"
              >
                Back to Pricing
              </button>
            </div>
          </div>
        </div>

        <Footer onNavigate={(section) => navigate(`/#${section}`)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 px-4">
            <div className="mb-4 sm:mb-6">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-emerald-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Enterprise Onboarding
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Help us understand your organization's sustainability needs
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 sm:mb-12">
            {/* Mobile: Simplified progress bar */}
            <div className="sm:hidden">
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Step {currentStep} of {totalSteps}</span>
                  <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Desktop: Full progress bar with numbers */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                      } ${step === currentStep ? 'ring-4 ring-emerald-200 scale-110' : ''}`}
                    >
                      {step}
                    </div>
                    {step < 5 && (
                      <div
                        className={`flex-1 h-1 mx-1 md:mx-2 transition-all duration-300 ${
                          step < currentStep ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center text-xs md:text-sm text-gray-600 font-medium">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-xl">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Company Information</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
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
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-xl">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Requirements & Goals</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
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
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-xl">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Technical Requirements</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
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
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-xl">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Compliance & Reporting</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
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
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-xl">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Contact & Timeline</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              ← Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base transform ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={`w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base transform flex items-center justify-center gap-2 ${
                  isStepValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Application'}
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

