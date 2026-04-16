import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Shield, CheckCircle, Lock, Globe, FileText, Users, Zap } from 'lucide-react';
import Navbar from '../components/ecobserve/Navbar';
import Footer from '../components/ecobserve/Footer';

const Certifications: React.FC = () => {
  const navigate = useNavigate();

  const certifications = [
    {
      name: 'ISO 27001',
      status: 'In Progress',
      category: 'Information Security',
      icon: Shield,
      color: 'blue',
      description: 'International standard for information security management systems',
      details: [
        'Systematic approach to managing sensitive company information',
        'Data remains secure and confidential',
        'Risk management framework',
        'Continuous improvement process'
      ]
    },
    {
      name: 'SOC 2 Type II',
      status: 'In Progress',
      category: 'Security & Trust',
      icon: Lock,
      color: 'purple',
      description: 'Security, availability, and confidentiality controls',
      details: [
        'Third-party audited security controls',
        'Availability of systems and services',
        'Processing integrity assurance',
        'Confidentiality protection'
      ]
    },
    {
      name: 'GDPR Compliant',
      status: 'Compliant',
      category: 'Data Privacy',
      icon: Globe,
      color: 'emerald',
      description: 'European Union data protection and privacy regulation',
      details: [
        'Data protection by design and default',
        'User consent management',
        'Right to access and deletion',
        'Data breach notification procedures'
      ]
    },
    {
      name: 'POPIA Compliant',
      status: 'Compliant',
      category: 'Data Privacy (South Africa)',
      icon: FileText,
      color: 'teal',
      description: 'Protection of Personal Information Act (South Africa)',
      details: [
        'Lawful processing of personal information',
        'Data subject participation',
        'Information quality standards',
        'Safeguarding measures'
      ]
    }
  ];

  const upcomingCertifications = [
    {
      name: 'B Corp Certification',
      timeline: '2026 Q3',
      description: 'Certification for businesses meeting high standards of social and environmental performance'
    },
    {
      name: 'Carbon Neutral Certification',
      timeline: '2026 Q4',
      description: 'Third-party verification of our carbon neutral operations'
    },
    {
      name: 'Green Business Bureau',
      timeline: '2027 Q1',
      description: 'Recognition for sustainable business practices'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar onNavigate={(section) => navigate(`/#${section}`)} activeSection="" />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Certifications & Compliance
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to security, privacy, and sustainability standards
            </p>
          </div>

          {/* Trust Statement */}
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Trust, Security & Transparency
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  At EcobServe, we take security, privacy, and compliance seriously. We're committed to achieving and maintaining industry-leading certifications to ensure your data is protected and our operations meet the highest standards.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  As a growing platform, we're actively working towards obtaining key certifications. This page provides transparency about our current compliance status and certification roadmap.
                </p>
              </div>
            </div>
          </div>

          {/* Current Certifications & Compliance */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Current Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, idx) => {
                const IconComponent = cert.icon;
                const isCompliant = cert.status === 'Compliant';
                
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex items-center justify-center w-12 h-12 bg-${cert.color}-100 rounded-xl`}>
                        <IconComponent className={`w-6 h-6 text-${cert.color}-600`} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isCompliant
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {cert.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{cert.category}</p>
                    <p className="text-gray-700 mb-4">{cert.description}</p>

                    <div className="space-y-2">
                      {cert.details.map((detail, detailIdx) => (
                        <div key={detailIdx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security & Privacy Measures */}
          <div className="mb-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-6">Security & Privacy Measures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Data Encryption
                </h3>
                <p className="text-blue-50 text-sm">
                  End-to-end encryption for data in transit (TLS 1.3) and at rest (AES-256)
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Multi-Tenant Architecture
                </h3>
                <p className="text-blue-50 text-sm">
                  Complete data isolation between organizations with role-based access control
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Access Controls
                </h3>
                <p className="text-blue-50 text-sm">
                  RBAC (Role-Based Access Control) with granular permissions and audit logging
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Regular Security Audits
                </h3>
                <p className="text-blue-50 text-sm">
                  Quarterly penetration testing and continuous vulnerability scanning
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Incident Response
                </h3>
                <p className="text-blue-50 text-sm">
                  24/7 monitoring with documented incident response procedures
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Compliance Monitoring
                </h3>
                <p className="text-blue-50 text-sm">
                  Automated compliance checks and regular third-party audits
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Certifications */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Certification Roadmap</h2>
            <p className="text-gray-600 mb-8">
              We're actively working towards obtaining additional certifications to ensure we meet the highest industry standards:
            </p>
            <div className="space-y-4">
              {upcomingCertifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{cert.name}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Target: {cert.timeline}
                        </span>
                      </div>
                      <p className="text-gray-600">{cert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Privacy Rights */}
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Data Privacy Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Access</h3>
                  <p className="text-sm text-gray-600">Request a copy of your personal data we hold</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Rectification</h3>
                  <p className="text-sm text-gray-600">Correct inaccurate or incomplete data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Erasure</h3>
                  <p className="text-sm text-gray-600">Request deletion of your personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Data Portability</h3>
                  <p className="text-sm text-gray-600">Export your data in a machine-readable format</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Right to Object</h3>
                  <p className="text-sm text-gray-600">Object to certain data processing activities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Consent Management</h3>
                  <p className="text-sm text-gray-600">Withdraw consent for data processing at any time</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                To exercise any of these rights, please contact our Data Protection Officer:
              </p>
              <a
                href="mailto:privacy@ecobserve.com"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                privacy@ecobserve.com
              </a>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-xl text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Our Certifications?</h2>
            <p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
              We're committed to transparency about our security and compliance posture. If you have questions about our certifications or security practices, we're happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:security@ecobserve.com"
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
              >
                Contact Security Team
              </a>
              <a
                href="/contact"
                className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors border-2 border-emerald-400"
              >
                General Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={(section) => navigate(`/#${section}`)} />
    </div>
  );
};

export default Certifications;
