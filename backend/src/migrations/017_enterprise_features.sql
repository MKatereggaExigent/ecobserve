-- Migration 017: Enterprise Features
-- API Documentation, Onboarding Questionnaire, Feature Requests, Bug Reports, Quarterly Reviews

-- ============================================
-- Enterprise Onboarding Questionnaire
-- ============================================
CREATE TABLE IF NOT EXISTS enterprise_onboarding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Company Information
    company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '201-500', '500+'
    industry VARCHAR(100),
    current_tools TEXT[], -- Array of current tools they use
    
    -- Requirements & Goals
    primary_goals TEXT[], -- Sustainability goals
    expected_events_per_year INTEGER,
    team_size INTEGER,
    locations INTEGER, -- Number of locations they operate from
    
    -- Technical Requirements
    requires_api BOOLEAN DEFAULT false,
    requires_onpremise BOOLEAN DEFAULT false,
    requires_sso BOOLEAN DEFAULT false,
    requires_custom_branding BOOLEAN DEFAULT false,
    integration_needs TEXT[], -- Systems they need to integrate with
    
    -- Compliance & Reporting
    compliance_standards TEXT[], -- ISO, GRI, CDP, etc.
    reporting_frequency VARCHAR(50), -- 'monthly', 'quarterly', 'yearly'
    custom_requirements TEXT,
    
    -- Timeline & Budget
    expected_start_date DATE,
    budget_range VARCHAR(50),
    decision_timeline VARCHAR(50), -- 'immediate', '1-3 months', '3-6 months', '6+ months'
    
    -- Contact & Follow-up
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    preferred_contact_method VARCHAR(50), -- 'email', 'phone', 'video call'
    
    -- Status
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'in_review', 'contacted', 'converted', 'declined'
    sales_notes TEXT,
    assigned_to UUID REFERENCES users(id), -- Sales rep assigned
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enterprise_onboarding_org ON enterprise_onboarding(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_onboarding_status ON enterprise_onboarding(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_onboarding_created ON enterprise_onboarding(created_at DESC);

-- ============================================
-- Feature Requests
-- ============================================
CREATE TABLE IF NOT EXISTS feature_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Request Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50), -- 'analytics', 'reporting', 'integrations', 'sustainability', 'other'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    
    -- Use Case
    use_case TEXT, -- Why they need this feature
    affected_users INTEGER, -- How many users would benefit
    current_workaround TEXT, -- What they're doing now
    
    -- Technical Details
    requires_onpremise BOOLEAN DEFAULT false,
    technical_notes TEXT,
    attachments JSONB DEFAULT '[]', -- File URLs or references
    
    -- Status & Tracking
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'planned', 'in_progress', 'completed', 'declined'
    votes INTEGER DEFAULT 0, -- Upvotes from other users
    roadmap_quarter VARCHAR(20), -- 'Q1 2024', 'Q2 2024', etc.
    estimated_completion DATE,
    
    -- Internal Notes
    internal_notes TEXT,
    assigned_to UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feature_requests_user ON feature_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_org ON feature_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_requests_votes ON feature_requests(votes DESC);

-- ============================================
-- Bug Reports
-- ============================================
CREATE TABLE IF NOT EXISTS bug_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Bug Details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    category VARCHAR(50), -- 'ui', 'api', 'performance', 'data', 'security', 'other'
    
    -- Reproduction
    steps_to_reproduce TEXT,
    expected_behavior TEXT,
    actual_behavior TEXT,
    
    -- Environment
    browser VARCHAR(100),
    os VARCHAR(100),
    device VARCHAR(100),
    page_url TEXT,
    
    -- Attachments
    screenshots JSONB DEFAULT '[]', -- Screenshot URLs
    error_logs TEXT,
    
    -- Status & Resolution
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed', 'wont_fix'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bug_reports_user ON bug_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_bug_reports_org ON bug_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_severity ON bug_reports(severity);
CREATE INDEX IF NOT EXISTS idx_bug_reports_created ON bug_reports(created_at DESC);

-- ============================================
-- Quarterly Business Reviews
-- ============================================
CREATE TABLE IF NOT EXISTS quarterly_business_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Review Period
    quarter VARCHAR(10) NOT NULL, -- 'Q1', 'Q2', 'Q3', 'Q4'
    year INTEGER NOT NULL,
    review_date DATE NOT NULL,

    -- Metrics Summary (auto-generated from platform data)
    total_events INTEGER DEFAULT 0,
    total_co2_offset_kg DECIMAL(15, 2) DEFAULT 0,
    total_water_saved_liters DECIMAL(15, 2) DEFAULT 0,
    total_waste_diverted_kg DECIMAL(15, 2) DEFAULT 0,
    average_green_score DECIMAL(5, 2) DEFAULT 0,

    -- Team Usage
    active_users INTEGER DEFAULT 0,
    total_logins INTEGER DEFAULT 0,
    features_used TEXT[],

    -- Goals & Achievements
    quarterly_goals TEXT,
    achievements TEXT,
    areas_for_improvement TEXT,

    -- Recommendations
    recommended_features TEXT[],
    recommended_upgrades TEXT,

    -- Communication
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    meeting_scheduled BOOLEAN DEFAULT false,
    meeting_date TIMESTAMP WITH TIME ZONE,
    meeting_notes TEXT,

    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'meeting_scheduled', 'completed'

    -- PDF Report
    report_url TEXT, -- S3 or local URL to generated PDF

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(organization_id, quarter, year)
);

CREATE INDEX IF NOT EXISTS idx_qbr_org ON quarterly_business_reviews(organization_id);
CREATE INDEX IF NOT EXISTS idx_qbr_year_quarter ON quarterly_business_reviews(year DESC, quarter);
CREATE INDEX IF NOT EXISTS idx_qbr_status ON quarterly_business_reviews(status);
CREATE INDEX IF NOT EXISTS idx_qbr_review_date ON quarterly_business_reviews(review_date);

-- ============================================
-- Enterprise Contact Log (for automated emails)
-- ============================================
CREATE TABLE IF NOT EXISTS enterprise_contact_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Contact Type
    contact_type VARCHAR(50) NOT NULL, -- 'pricing_info', 'qbr', 'feature_update', 'onboarding', 'check_in'

    -- Message Details
    subject VARCHAR(255),
    message_body TEXT,
    email_to VARCHAR(255),

    -- Status
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP WITH TIME ZONE,
    replied BOOLEAN DEFAULT false,
    replied_at TIMESTAMP WITH TIME ZONE,

    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enterprise_contact_org ON enterprise_contact_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_contact_type ON enterprise_contact_log(contact_type);
CREATE INDEX IF NOT EXISTS idx_enterprise_contact_scheduled ON enterprise_contact_log(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_enterprise_contact_sent ON enterprise_contact_log(sent, sent_at);

-- ============================================
-- Feature Request Votes (for upvoting)
-- ============================================
CREATE TABLE IF NOT EXISTS feature_request_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_request_id UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(feature_request_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_feature_votes_request ON feature_request_votes(feature_request_id);
CREATE INDEX IF NOT EXISTS idx_feature_votes_user ON feature_request_votes(user_id);

-- ============================================
-- Functions
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_updated_at trigger to all tables
CREATE TRIGGER update_enterprise_onboarding_updated_at BEFORE UPDATE ON enterprise_onboarding
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_requests_updated_at BEFORE UPDATE ON feature_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bug_reports_updated_at BEFORE UPDATE ON bug_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qbr_updated_at BEFORE UPDATE ON quarterly_business_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enterprise_contact_updated_at BEFORE UPDATE ON enterprise_contact_log
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

