const AWS = require('aws-sdk'); 
const s3BrowserDirectUpload = require('s3-browser-direct-upload');

const createResponse = (statusCode, body, headers) => {
	return {
		statusCode: statusCode,
		body: JSON.stringify(body) || '',
		headers: headers || {}
	}
};

const getExpiry = () => {
	const date = new Date();
	date.setHours(date.getHours() + 24);
	return date;
};

const getUploadParams = (event, context, callback) => {
	if (!event || !event.queryStringParameters || !event.queryStringParameters.filename) {
		callback(null, createResponse(400, { error: 'filename is required' }));
		return;
	}
	if (!process.env.VIDEO_UPLOAD_ACCESS_KEY_ID || !process.env.VIDEO_UPLOAD_SECRET_ACCESS_KEY) {
		callback(null, createResponse(400, { error: 'access and secret keys are required' }));
		return;
	}
	if (!process.env.VIDEO_UPLOAD_BUCKET_NAME) {
		callback(null, createResponse(400, { error: 'bucket name is required' }));
		return;
	}

	const timestamp = new Date().toISOString();
	const filename = event.queryStringParameters.filename;
	const key = `${timestamp}--${filename}`;
	const uploadApi = new s3BrowserDirectUpload({
		accessKeyId: process.env.VIDEO_UPLOAD_ACCESS_KEY_ID,
		secretAccessKey: process.env.VIDEO_UPLOAD_SECRET_ACCESS_KEY,
		region: 'eu-west-1'
	})
	uploadApi.uploadPostForm({
		key: key,
		bucket: process.env.VIDEO_UPLOAD_BUCKET_NAME,
		acl: 'private',
		expires: getExpiry()
	}, (err, data) => {
		callback(null, err ? createResponse(500, { error: err.message }) : createResponse(200, data));
	});
};

module.exports = { getUploadParams };