# Enterprise Features Implementation Guide

## Overview
This document outlines the comprehensive enterprise feature build-out for EcobServe, including API documentation, enterprise onboarding, feature requests, bug reports, and automated quarterly business reviews.

## ✅ Completed Backend Work

### 1. Database Schema (Migration 017)

**File**: `backend/src/migrations/017_enterprise_features.sql`

Created 6 new tables:

1. **`enterprise_onboarding`** - Captures enterprise customer requirements
   - Company information (size, industry, current tools)
   - Requirements & goals (API needs, on-premise, SSO, custom branding)
   - Compliance & reporting needs
   - Contact & timeline information
   - Sales tracking (status, notes, assigned rep)

2. **`feature_requests`** - User-submitted feature requests
   - Request details (title, description, category, priority)
   - Use case & impact assessment
   - Voting system for popularity
   - Status tracking (submitted → under review → planned → in progress → completed)
   - On-premise deployment flag

3. **`bug_reports`** - Comprehensive bug tracking
   - Bug details (severity, category)
   - Reproduction steps & expected vs actual behavior
   - Environment info (browser, OS, device)
   - Screenshots & error logs support
   - Status & resolution tracking

4. **`quarterly_business_reviews`** - Automated QBR system
   - Quarterly metrics (events, CO2, water, waste)
   - Team usage statistics
   - Goals & achievements tracking
   - Meeting scheduling & notes
   - PDF report generation support

5. **`enterprise_contact_log`** - Automated email tracking
   - Contact type (pricing, QBR, feature updates, onboarding)
   - Email delivery & engagement tracking (sent, opened, replied)
   - Scheduling support for automated emails

6. **`feature_request_votes`** - Upvoting system
   - Tracks user votes on feature requests
   - Prevents duplicate votes

### 2. Backend Controllers

**File**: `backend/src/controllers/enterprise.controller.ts`

Implemented 9 controller functions:

#### Enterprise Onboarding
- `submitOnboarding()` - Submit enterprise questionnaire with auto-email scheduling
- `getOnboardingSubmissions()` - Admin view of all submissions
- `getMyOnboarding()` - User view of their submission

#### Feature Requests
- `submitFeatureRequest()` - Submit new feature request
- `getFeatureRequests()` - List all requests (sorted by votes)
- `voteFeatureRequest()` - Upvote/downvote feature requests

#### Bug Reports
- `submitBugReport()` - Submit bug report with environment details
- `getBugReports()` - List all bugs (sorted by severity)

#### Quarterly Business Reviews
- `getQuarterlyReviews()` - Fetch QBRs for organization

### 3. API Routes

**File**: `backend/src/routes/enterprise.routes.ts`

Created RESTful endpoints:

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/enterprise/onboarding` | Submit enterprise questionnaire | Authenticated |
| GET | `/api/enterprise/onboarding/my` | Get my submission | Authenticated |
| GET | `/api/enterprise/onboarding` | Get all submissions | Admin only |
| POST | `/api/enterprise/feature-requests` | Submit feature request | Authenticated |
| GET | `/api/enterprise/feature-requests` | List feature requests | Authenticated |
| POST | `/api/enterprise/feature-requests/:id/vote` | Vote on request | Authenticated |
| POST | `/api/enterprise/bug-reports` | Submit bug report | Authenticated |
| GET | `/api/enterprise/bug-reports` | List bug reports | Authenticated |
| GET | `/api/enterprise/quarterly-reviews` | Get QBRs | Authenticated |

### 4. API Documentation (Swagger/OpenAPI)

**Files**:
- `backend/src/config/swagger.ts` - OpenAPI 3.0 configuration
- `backend/src/routes/swagger.routes.ts` - Swagger UI server

**Endpoints**:
- `/api/docs` - Interactive Swagger UI (protected/public based on config)
- `/api/docs/spec.json` - OpenAPI JSON specification

**Features**:
- Auto-generated from route definitions
- Interactive "Try it out" functionality
- Bearer token authentication support
- Comprehensive API documentation for enterprise demos

### 5. Routes Registration

**File**: `backend/src/routes/index.ts`

Registered new routes:
```typescript
router.use('/enterprise', enterpriseRoutes);
router.use('/docs', swaggerRoutes);
```

## ✅ Completed Frontend Work

### 1. Enterprise Onboarding Page
**File**: `src/pages/EnterpriseOnboarding.tsx`
**Route**: `/enterprise/onboarding`

**Features implemented**:
- ✅ Interactive 5-step questionnaire with progress bar
- ✅ Step 1: Company Information (size, industry, current tools)
- ✅ Step 2: Requirements & Goals (sustainability goals, events/year, team size, locations)
- ✅ Step 3: Technical Requirements (API, on-premise, SSO, custom branding, integrations)
- ✅ Step 4: Compliance & Reporting (standards, frequency, custom requirements)
- ✅ Step 5: Contact & Timeline (contact info, start date, decision timeline, budget)
- ✅ Form validation per step
- ✅ Success confirmation page
- ✅ Auto-email trigger to sales team
- ✅ Full integration with backend API

### 2. Feature Request & Bug Report Page
**File**: `src/pages/FeatureRequestsBugs.tsx`
**Route**: `/feature-requests`

**Features implemented**:
- ✅ Tabbed interface (Feature Requests | Bug Reports)
- ✅ Feature Request form:
  - Title, description, category, use case
  - **On-premise deployment checkbox** ✨
  - Affected users, current workaround
  - Technical notes
- ✅ Bug Report form:
  - Title, description, severity, category
  - Steps to reproduce
  - Expected vs actual behavior
  - **Environment auto-detection** (browser, OS, device) ✨
  - Error logs field
- ✅ List view for both feature requests and bug reports
- ✅ **Voting system** for feature requests with upvote UI ✨
- ✅ Status badges (submitted, under review, planned, in progress, completed)
- ✅ Severity badges for bugs (low, medium, high, critical)
- ✅ Full backend integration with real-time updates

### 3. API Documentation (Swagger UI)
**Files**:
- `backend/src/config/swagger.ts`
- `backend/src/routes/swagger.routes.ts`

**Route**: `/api/docs`

**Features implemented**:
- ✅ Full Swagger/OpenAPI 3.0 documentation
- ✅ Interactive "Try it out" functionality
- ✅ Bearer token authentication support
- ✅ All EcobServe endpoints documented
- ✅ Ready for enterprise customer demos
- ✅ JSON spec available at `/api/docs/spec.json`

## 🤖 Automated Systems (To Implement)

### 1. Quarterly Business Review Generator

**Trigger**: Cron job (first day of each quarter)

**Process**:
1. For each enterprise organization:
   - Calculate quarterly metrics from `events` table
   - Generate QBR record in `quarterly_business_reviews`
   - Create PDF report
   - Schedule email in `enterprise_contact_log`

### 2. Enterprise Contact Automation

**Triggers**:
- New enterprise customer created → Welcome email
- 24 hours after onboarding → Follow-up email
- Every quarter → QBR email
- Feature request status change → Notification email

**Implementation**: Background job service (node-cron or agenda.js)

## 📋 Deployment Checklist

### Database Migration
```bash
# On server
cd ~/ecobserve/backend
docker exec ecobserve-db psql -U postgres -d ecobserve < src/migrations/017_enterprise_features.sql
```

### Verify Tables Created
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('enterprise_onboarding', 'feature_requests', 'bug_reports', 'quarterly_business_reviews', 'enterprise_contact_log', 'feature_request_votes');
```

### Test Endpoints
```bash
# Test Swagger UI
curl https://ecobserve.aidocumines.com/api/docs

# Test feature request endpoint
curl -X POST https://ecobserve.aidocumines.com/api/enterprise/feature-requests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Feature","description":"Test","useCase":"Testing"}'
```

## 📋 Routes Added to App.tsx

**File**: `src/App.tsx`

Added routes:
```typescript
<Route path="/enterprise/onboarding" element={<EnterpriseOnboarding />} />
<Route path="/feature-requests" element={<FeatureRequestsBugs />} />
```

API Documentation available at: `/api/docs` (backend route)

## Next Steps

1. ✅ Remove duplicate "Carbon offset marketplace" from Enterprise plan - **DONE**
2. ✅ Create database tables for enterprise features - **DONE**
3. ✅ Create backend controllers & routes - **DONE**
4. ✅ Create API documentation with Swagger - **DONE**
5. ✅ Create frontend pages (onboarding, feature requests, bug reports) - **DONE**
6. ✅ Add routes to App.tsx - **DONE**
7. ⏳ Run database migration on production server
8. ⏳ Create automated QBR generation service (cron job)
9. ⏳ Create automated email service for enterprise contacts
10. ⏳ Test all endpoints
11. ⏳ Deploy to production

