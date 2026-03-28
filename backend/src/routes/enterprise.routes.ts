import { Router } from 'express';
import * as enterpriseController from '../controllers/enterprise.controller';
import { authenticate, requireOrganization } from '../middleware/auth';
import { loadUserPermissions, requirePermission } from '../middleware/rbac';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(loadUserPermissions);
router.use(requireOrganization);

// ============================================
// Enterprise Onboarding
// ============================================

/**
 * POST /api/enterprise/onboarding
 * Submit enterprise onboarding questionnaire
 * @access Authenticated users
 */
router.post(
  '/onboarding',
  enterpriseController.submitOnboardingValidation,
  enterpriseController.submitOnboarding
);

/**
 * GET /api/enterprise/onboarding/my
 * Get my organization's onboarding submission
 * @access Authenticated users
 */
router.get('/onboarding/my', enterpriseController.getMyOnboarding);

/**
 * GET /api/enterprise/onboarding
 * Get all onboarding submissions (admin/sales only)
 * @access Admin
 */
router.get(
  '/onboarding',
  requirePermission('admin:access'),
  enterpriseController.getOnboardingSubmissions
);

// ============================================
// Feature Requests
// ============================================

/**
 * POST /api/enterprise/feature-requests
 * Submit a feature request
 * @access Authenticated users
 */
router.post(
  '/feature-requests',
  enterpriseController.submitFeatureRequestValidation,
  enterpriseController.submitFeatureRequest
);

/**
 * GET /api/enterprise/feature-requests
 * Get all feature requests
 * @access Authenticated users
 */
router.get('/feature-requests', enterpriseController.getFeatureRequests);

/**
 * POST /api/enterprise/feature-requests/:id/vote
 * Vote on a feature request
 * @access Authenticated users
 */
router.post('/feature-requests/:id/vote', enterpriseController.voteFeatureRequest);

// ============================================
// Bug Reports
// ============================================

/**
 * POST /api/enterprise/bug-reports
 * Submit a bug report
 * @access Authenticated users
 */
router.post(
  '/bug-reports',
  enterpriseController.submitBugReportValidation,
  enterpriseController.submitBugReport
);

/**
 * GET /api/enterprise/bug-reports
 * Get all bug reports
 * @access Authenticated users (filtered by permission)
 */
router.get('/bug-reports', enterpriseController.getBugReports);

// ============================================
// Quarterly Business Reviews
// ============================================

/**
 * GET /api/enterprise/quarterly-reviews
 * Get quarterly business reviews for the organization
 * @access Authenticated users
 */
router.get('/quarterly-reviews', enterpriseController.getQuarterlyReviews);

export default router;

