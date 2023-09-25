import { Router } from 'express';

import { controller } from '../controllers/index.js';
import { validator } from '../middlewares/validators/index.js';
import { handler } from '../middlewares/handlers/index.js';

const router = Router();

router
	.route('/convert?[input]')
	.get(validator.convert.getConvertedUnits, controller.convert.getConvertedUnits)
	.all(handler.error._405);

export default router;
