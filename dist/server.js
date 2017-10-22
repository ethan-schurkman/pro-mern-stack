'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

require('babel-polyfill');

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

const app = (0, _express2.default)();
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

/*if(process.env.NODE_ENV !== 'production') {
	const webpack = require('webpack');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');

	const config = require('../webpack.config');
	config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/only-dev-server');
	config.plugins.push(new webpack.HotModuleReplacementPlugin());

	const bundler = webpack(config);
	app.use(webpackDevMiddleware(bundler, {noInfo: true}));
	app.use(webpackHotMiddleware(bundler,{log:console.log}));
} --> This was to install HMRs inline with express server code. It has it's pros and cons. I like it,
----> but for book we will maintain web-dev-server separate from express server.*/

//throw new Error('Test!');

app.get('/api/issues', (req, res) => {
	db.collection('issues').find().toArray().then(issues => {
		const metadata = { total_count: issues.length };
		res.json({ _metadata: metadata, records: issues });
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal server error: ${error}` });
	});
});

app.post('/api/issues', (req, res) => {
	const newIssue = req.body;
	newIssue.created = new Date();
	if (!newIssue.status) {
		newIssue.status = 'New';
	}

	const err = _issue2.default.validateIssue(newIssue);
	if (err) {
		res.status(422).json({ message: `Invalid request: ${err}` });
		return;
	}

	db.collection('issues').insertOne(newIssue).then(result => db.collection('issues').find({ _id: result.insertedId }).limit(1).next() //I tried using brackets here and to no avail...
	//just want to be consistent here what is the catch?	
	).then(newIssue => {
		res.json(newIssue);
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal server error: ${error}` });
	});
});

let db;
_mongodb.MongoClient.connect('mongodb://localhost/issuetracker').then(connection => {
	db = connection;
	app.listen(3000, function () {
		console.log('App started on port 3000');
	});
}).catch(error => {
	console.log('ERROR:', error);
});
//# sourceMappingURL=server.js.map