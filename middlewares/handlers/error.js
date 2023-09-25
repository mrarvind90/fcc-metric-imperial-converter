import logger from '../../config/logger.js';

export const _404 = (req, res) => {
	const statusCode = 404;

	logger.error(`${req.method} ${req.path} ${statusCode}`);
	res.status(statusCode).json({ error: 'Not Found' });
};

export const _405 = (req, res) => {
	logger.error(`${req.method} is not allowed on ${req.path}`);
	res.status(405).json({ error: `${req.method} is not allowed on ${req.path}` });
};
