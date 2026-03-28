import { Request, Response } from 'express';
import { query } from '../config/database';
import { logger } from '../utils/logger';
import { body, validationResult } from 'express-validator';

/**
 * Submit Enterprise Onboarding Questionnaire
 */
export const submitOnboardingValidation = [
  body('companySize').notEmpty().withMessage('Company size is required'),
  body('industry').notEmpty().withMessage('Industry is required'),
  body('primaryGoals').isArray().withMessage('Primary goals must be an array'),
  body('expectedEventsPerYear').isInt({ min: 1 }).withMessage('Expected events per year must be a positive integer'),
  body('teamSize').isInt({ min: 1 }).withMessage('Team size must be a positive integer'),
  body('primaryContactName').notEmpty().withMessage('Primary contact name is required'),
  body('primaryContactEmail').isEmail().withMessage('Valid email is required'),
];

export async function submitOnboarding(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.userId || !req.organizationId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      companySize,
      industry,
      currentTools,
      primaryGoals,
      expectedEventsPerYear,
      teamSize,
      locations,
      requiresApi,
      requiresOnpremise,
      requiresSso,
      requiresCustomBranding,
      integrationNeeds,
      complianceStandards,
      reportingFrequency,
      customRequirements,
      expectedStartDate,
      budgetRange,
      decisionTimeline,
      primaryContactName,
      primaryContactEmail,
      primaryContactPhone,
      preferredContactMethod,
    } = req.body;

    const result = await query(
      `INSERT INTO enterprise_onboarding (
        organization_id, user_id, company_size, industry, current_tools,
        primary_goals, expected_events_per_year, team_size, locations,
        requires_api, requires_onpremise, requires_sso, requires_custom_branding,
        integration_needs, compliance_standards, reporting_frequency, custom_requirements,
        expected_start_date, budget_range, decision_timeline,
        primary_contact_name, primary_contact_email, primary_contact_phone, preferred_contact_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING *`,
      [
        req.organizationId, req.user.userId, companySize, industry, currentTools || [],
        primaryGoals, expectedEventsPerYear, teamSize, locations || 1,
        requiresApi || false, requiresOnpremise || false, requiresSso || false, requiresCustomBranding || false,
        integrationNeeds || [], complianceStandards || [], reportingFrequency, customRequirements,
        expectedStartDate, budgetRange, decisionTimeline,
        primaryContactName, primaryContactEmail, primaryContactPhone, preferredContactMethod,
      ]
    );

    // Schedule automated follow-up email
    await query(
      `INSERT INTO enterprise_contact_log (organization_id, contact_type, subject, email_to, scheduled_for)
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '1 day')`,
      [
        req.organizationId,
        'onboarding',
        'Thank you for your Enterprise interest',
        primaryContactEmail,
      ]
    );

    logger.info(`Enterprise onboarding submitted for org ${req.organizationId}`);

    res.status(201).json({
      success: true,
      message: 'Onboarding questionnaire submitted successfully. Our team will contact you within 24 hours.',
      data: result[0],
    });
  } catch (error) {
    logger.error('Submit onboarding error:', error);
    res.status(500).json({ error: 'Failed to submit onboarding questionnaire' });
  }
}

/**
 * Get onboarding submissions (admin/sales team)
 */
export async function getOnboardingSubmissions(req: Request, res: Response) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = '1=1';
    const params: any[] = [];

    if (status) {
      params.push(status);
      whereClause += ` AND status = $${params.length}`;
    }

    const results = await query(
      `SELECT eo.*, 
              o.name as organization_name,
              u.email as user_email,
              u.full_name as user_name
       FROM enterprise_onboarding eo
       LEFT JOIN organizations o ON eo.organization_id = o.id
       LEFT JOIN users u ON eo.user_id = u.id
       WHERE ${whereClause}
       ORDER BY eo.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, Number(limit), offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM enterprise_onboarding WHERE ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult[0].total),
      },
    });
  } catch (error) {
    logger.error('Get onboarding submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch onboarding submissions' });
  }
}

/**
 * Get my onboarding submission
 */
export async function getMyOnboarding(req: Request, res: Response) {
  try {
    const result = await query(
      `SELECT * FROM enterprise_onboarding
       WHERE organization_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [req.organizationId]
    );

    res.json({
      success: true,
      data: result[0] || null,
    });
  } catch (error) {
    logger.error('Get my onboarding error:', error);
    res.status(500).json({ error: 'Failed to fetch onboarding data' });
  }
}

// ============================================
// FEATURE REQUESTS
// ============================================

export const submitFeatureRequestValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').optional().isIn(['analytics', 'reporting', 'integrations', 'sustainability', 'other']),
  body('useCase').notEmpty().withMessage('Use case is required'),
];

export async function submitFeatureRequest(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.userId || !req.organizationId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      title,
      description,
      category,
      priority,
      useCase,
      affectedUsers,
      currentWorkaround,
      requiresOnpremise,
      technicalNotes,
      attachments,
    } = req.body;

    const result = await query(
      `INSERT INTO feature_requests (
        organization_id, user_id, title, description, category, priority,
        use_case, affected_users, current_workaround, requires_onpremise,
        technical_notes, attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        req.organizationId,
        req.user.userId,
        title,
        description,
        category || 'other',
        priority || 'medium',
        useCase,
        affectedUsers || 1,
        currentWorkaround,
        requiresOnpremise || false,
        technicalNotes,
        JSON.stringify(attachments || []),
      ]
    );

    logger.info(`Feature request created: ${title} by user ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Feature request submitted successfully',
      data: result[0],
    });
  } catch (error) {
    logger.error('Submit feature request error:', error);
    res.status(500).json({ error: 'Failed to submit feature request' });
  }
}

export async function getFeatureRequests(req: Request, res: Response) {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = '1=1';
    const params: any[] = [];

    if (status) {
      params.push(status);
      whereClause += ` AND status = $${params.length}`;
    }

    if (category) {
      params.push(category);
      whereClause += ` AND category = $${params.length}`;
    }

    const results = await query(
      `SELECT fr.*,
              u.email as user_email,
              u.full_name as user_name,
              o.name as organization_name,
              (SELECT COUNT(*) FROM feature_request_votes WHERE feature_request_id = fr.id) as vote_count
       FROM feature_requests fr
       LEFT JOIN users u ON fr.user_id = u.id
       LEFT JOIN organizations o ON fr.organization_id = o.id
       WHERE ${whereClause}
       ORDER BY vote_count DESC, fr.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, Number(limit), offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM feature_requests WHERE ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult[0].total),
      },
    });
  } catch (error) {
    logger.error('Get feature requests error:', error);
    res.status(500).json({ error: 'Failed to fetch feature requests' });
  }
}

export async function voteFeatureRequest(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    // Check if already voted
    const existingVote = await query(
      'SELECT id FROM feature_request_votes WHERE feature_request_id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (existingVote.length > 0) {
      // Remove vote
      await query(
        'DELETE FROM feature_request_votes WHERE feature_request_id = $1 AND user_id = $2',
        [id, req.user.userId]
      );

      res.json({
        success: true,
        message: 'Vote removed',
        voted: false,
      });
      return;
    }

    // Add vote
    await query(
      'INSERT INTO feature_request_votes (feature_request_id, user_id) VALUES ($1, $2)',
      [id, req.user.userId]
    );

    // Update vote count
    await query(
      'UPDATE feature_requests SET votes = (SELECT COUNT(*) FROM feature_request_votes WHERE feature_request_id = $1) WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Vote added',
      voted: true,
    });
  } catch (error) {
    logger.error('Vote feature request error:', error);
    res.status(500).json({ error: 'Failed to vote' });
  }
}

// ============================================
// BUG REPORTS
// ============================================

export const submitBugReportValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 255 }),
  body('description').notEmpty().withMessage('Description is required'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('stepsToReproduce').notEmpty().withMessage('Steps to reproduce are required'),
];

export async function submitBugReport(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user?.userId || !req.organizationId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      title,
      description,
      severity,
      category,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      browser,
      os,
      device,
      pageUrl,
      screenshots,
      errorLogs,
    } = req.body;

    const result = await query(
      `INSERT INTO bug_reports (
        organization_id, user_id, title, description, severity, category,
        steps_to_reproduce, expected_behavior, actual_behavior,
        browser, os, device, page_url, screenshots, error_logs
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        req.organizationId,
        req.user.userId,
        title,
        description,
        severity || 'medium',
        category || 'other',
        stepsToReproduce,
        expectedBehavior,
        actualBehavior,
        browser,
        os,
        device,
        pageUrl,
        JSON.stringify(screenshots || []),
        errorLogs,
      ]
    );

    logger.info(`Bug report created: ${title} by user ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Bug report submitted successfully',
      data: result[0],
    });
  } catch (error) {
    logger.error('Submit bug report error:', error);
    res.status(500).json({ error: 'Failed to submit bug report' });
  }
}

export async function getBugReports(req: Request, res: Response) {
  try {
    const { status, severity, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = '1=1';
    const params: any[] = [];

    if (status) {
      params.push(status);
      whereClause += ` AND status = $${params.length}`;
    }

    if (severity) {
      params.push(severity);
      whereClause += ` AND severity = $${params.length}`;
    }

    const results = await query(
      `SELECT br.*,
              u.email as user_email,
              u.full_name as user_name,
              o.name as organization_name
       FROM bug_reports br
       LEFT JOIN users u ON br.user_id = u.id
       LEFT JOIN organizations o ON br.organization_id = o.id
       WHERE ${whereClause}
       ORDER BY
         CASE severity
           WHEN 'critical' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END,
         br.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, Number(limit), offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM bug_reports WHERE ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: parseInt(countResult[0].total),
      },
    });
  } catch (error) {
    logger.error('Get bug reports error:', error);
    res.status(500).json({ error: 'Failed to fetch bug reports' });
  }
}

// ============================================
// QUARTERLY BUSINESS REVIEWS
// ============================================

export async function getQuarterlyReviews(req: Request, res: Response) {
  try {
    const { year, quarter } = req.query;

    let whereClause = 'organization_id = $1';
    const params: any[] = [req.organizationId];

    if (year) {
      params.push(year);
      whereClause += ` AND year = $${params.length}`;
    }

    if (quarter) {
      params.push(quarter);
      whereClause += ` AND quarter = $${params.length}`;
    }

    const results = await query(
      `SELECT * FROM quarterly_business_reviews
       WHERE ${whereClause}
       ORDER BY year DESC, quarter DESC`,
      params
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    logger.error('Get quarterly reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch quarterly reviews' });
  }
}

