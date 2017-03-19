const video = require('../../src/video/upload');
const expect = require('chai').expect;

describe('video upload', () => {
	it('fails to get upload params', (done) => {
		process.env.VIDEO_UPLOAD_BUCKET_NAME = 'foo-bucket';
		video.getUploadParams({
			queryStringParameters: { filename: 'foo-filename' }
		}, null, (err, resp) => {
			if (err) {
				throw err;
			} else {
				expect(resp.statusCode).to.equal(400);
				const json = JSON.parse(resp.body);
				expect(json.error).to.equal('access and secret keys are required');
				done();
			}
		});
	});
	it('gets upload params', (done) => {
		process.env.VIDEO_UPLOAD_ACCESS_KEY_ID = 'foo-id';
		process.env.VIDEO_UPLOAD_SECRET_ACCESS_KEY = 'foo-secret';
		process.env.VIDEO_UPLOAD_BUCKET_NAME = 'foo-bucket';
		video.getUploadParams({
			queryStringParameters: { filename: 'foo-filename' }
		}, null, (err, resp) => {
			if (err) {
				throw err;
			} else {
				expect(resp.statusCode).to.equal(200);
				const json = JSON.parse(resp.body);
				expect(json.params.key).to.match(/^\d{4}-\d{2}-\d{2}.*--foo-filename$/);
				done();
			}
		});
	});
});