const Webtask = require('webtask-tools');
const app = require('./app');

module.exports = Webtask.fromExpress(app);
