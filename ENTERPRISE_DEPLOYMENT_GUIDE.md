# Enterprise Features Deployment Guide

## 🚀 Deployment Steps

### Step 1: Run Database Migration

**On your local machine:**

```bash
# SSH into the server
ssh aidocumines@datasqan

# Navigate to the backend directory
cd ~/ecobserve/backend

# Run the migration
docker exec ecobserve-db psql -U postgres -d ecobserve -f src/migrations/017_enterprise_features.sql
```

**Verify tables were created:**

```bash
docker exec ecobserve-db psql -U postgres -d ecobserve -c "\dt"
```

Look for these new tables:
- `enterprise_onboarding`
- `feature_requests`
- `feature_request_votes`
- `bug_reports`
- `quarterly_business_reviews`
- `enterprise_contact_log`

### Step 2: Deploy Frontend & Backend

**On your local machine (in the ecobserve directory):**

```bash
# Pull latest code
git pull origin main

# Deploy to CapRover
./deploy_to_caprover.sh
```

This will:
- Build the frontend with new pages
- Deploy backend with new routes
- Update the production environment

### Step 3: Verify Backend Endpoints

**Test Swagger UI:**

```bash
# Open in browser
open https://ecobserve.aidocumines.com/api/docs
```

**Test Enterprise Endpoints:**

```bash
# Health check
curl https://ecobserve.aidocumines.com/api/health

# Get feature requests (requires auth token)
curl https://ecobserve.aidocumines.com/api/enterprise/feature-requests \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Step 4: Verify Frontend Pages

**Test the new pages in browser:**

1. **Enterprise Onboarding:**
   - Go to: https://ecobserve.com/enterprise/onboarding
   - Fill out the 5-step questionnaire
   - Verify submission success

2. **Feature Requests & Bug Reports:**
   - Go to: https://ecobserve.com/feature-requests
   - Test both tabs (Feature Requests | Bug Reports)
   - Submit a test feature request
   - Submit a test bug report
   - Verify voting works on feature requests

3. **API Documentation:**
   - Go to: https://ecobserve.aidocumines.com/api/docs
   - Verify Swagger UI loads
   - Test "Try it out" functionality

### Step 5: Test Email Workflows (Optional)

**Onboarding Email:**

When someone submits the enterprise onboarding form:
1. Check `enterprise_onboarding` table for new record
2. Check `enterprise_contact_log` for email log entry
3. Verify email was sent to sales team

**QBR Email (Automated):**

Set up cron job to run quarterly:

```bash
# Add to crontab
0 9 1 1,4,7,10 * cd /home/aidocumines/ecobserve/backend && npm run qbr:send
```

## 📊 Database Queries for Testing

### Check enterprise submissions

```sql
SELECT * FROM enterprise_onboarding ORDER BY created_at DESC LIMIT 10;
```

### Check feature requests

```sql
SELECT fr.title, fr.status, COUNT(frv.user_id) as votes
FROM feature_requests fr
LEFT JOIN feature_request_votes frv ON fr.id = frv.feature_request_id
GROUP BY fr.id
ORDER BY votes DESC;
```

### Check bug reports

```sql
SELECT title, severity, status, created_at
FROM bug_reports
ORDER BY 
  CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  created_at DESC;
```

### Check contact logs

```sql
SELECT 
  organization_id,
  contact_type,
  status,
  created_at
FROM enterprise_contact_log
ORDER BY created_at DESC
LIMIT 20;
```

## 🔗 Quick Access Links

- **Swagger API Docs:** https://ecobserve.aidocumines.com/api/docs
- **Enterprise Onboarding:** https://ecobserve.com/enterprise/onboarding
- **Feature Requests:** https://ecobserve.com/feature-requests
- **Pricing Page (with Enterprise plan):** https://ecobserve.com/pricing

## ⚠️ Important Notes

1. **Authentication Required:** All enterprise endpoints require a valid JWT token
2. **Database Backups:** Always backup database before running migrations
3. **Email Configuration:** Ensure SMTP settings are configured for production emails
4. **Swagger Security:** Consider protecting `/api/docs` in production (enterprise-only)

## 📧 Email Automation (To Be Implemented)

### Automated Emails to Set Up:

1. **Welcome Email:** Triggered on new enterprise customer signup
2. **Onboarding Follow-up:** 24 hours after onboarding submission
3. **QBR Email:** First day of each quarter (Jan 1, Apr 1, Jul 1, Oct 1)
4. **Pricing Contact:** Based on decision timeline in onboarding form
5. **Feature Status Updates:** When feature request status changes

### Implementation Options:

- **Option 1:** Node-cron + nodemailer
- **Option 2:** Agenda.js (MongoDB-backed job queue)
- **Option 3:** External service (SendGrid, Mailgun scheduled sends)

**Recommended:** Use node-cron for simplicity, store email templates in database

## ✅ Checklist

- [ ] Database migration completed
- [ ] Frontend deployed to production
- [ ] Backend deployed to production
- [ ] Swagger UI accessible
- [ ] Enterprise onboarding page working
- [ ] Feature requests page working
- [ ] Bug reports page working
- [ ] Voting system working
- [ ] Email templates created
- [ ] Automated emails configured
- [ ] Cron jobs set up for QBR
- [ ] All endpoints tested
- [ ] Documentation updated

