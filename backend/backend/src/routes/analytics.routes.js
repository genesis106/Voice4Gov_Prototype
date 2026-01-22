import { Router } from 'express';
import { 
  getCompiledSubmissions, 
  aiQuery, 
  getAggregation 
} from '../controllers/analytics.controller.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();

// All analytics routes require authentication
router.use(verifyJWT);

// GET /api/v1/compiled-submissions
router.get('/compiled-submissions', getCompiledSubmissions);

// POST /api/v1/analytics/ai-query
router.post('/analytics/ai-query', aiQuery);

// POST /api/v1/analytics/aggregate
router.post('/analytics/aggregate', getAggregation);

export default router;