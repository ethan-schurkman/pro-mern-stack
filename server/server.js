import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import Issue from './issue.js';
import 'babel-polyfill';
import path from 'path';
import SourceMapSupport from 'source-map-support';
SourceMapSupport.install();

let db;
const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());


/* This was to install HMRs inline with express server code. It has it's pros and cons. I like it,
   but for book we will maintain web-dev-server separate from express server.

  if(process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    const config = require('../webpack.config');
    config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/only-dev-server');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const bundler = webpack(config);
    app.use(webpackDevMiddleware(bundler, {noInfo: true}));
    app.use(webpackHotMiddleware(bundler,{log:console.log}));
} */

// throw new Error('Test!');

app.get('/api/issues', (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.effort_lte || req.query.effort_gte) {
    filter.effort = {};
    /* In order to have a filter backoff to an underfined 'effort'.
       Probably not best approach. But works as crude proof of concept.
       Returns the lte or gte in addition to documents without an 'effort' field. */
    // filter.$or = {};
  }
  if (req.query.effort_lte) {
    filter.effort.$lte = parseInt(req.query.effort_lte, 10);
    /* filter.$or = [{effort: {$lte: parseInt(req.query.effort_lte, 10)}},
       {effort: {$exists: false}}]; */
  }
  if (req.query.effort_gte) {
    filter.effort.$gte = parseInt(req.query.effort_gte, 10);
    /* filter.$or = [{effort: {$gte: parseInt(req.query.effort_gte, 10)}},
       {effort: {$exists: false}}]; */
  }
  db.collection('issues').find(filter).toArray()
  .then(issues => {
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
  })
  .catch(error => {
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

  const err = Issue.validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }

  /* I tried using brackets here and to no avail like so...

  db.collection('issues').insertOne(newIssue).then(result => {
    db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
  })

    Just want to be consistent here what is the catch? */

  db.collection('issues').insertOne(Issue.cleanUpIssue(newIssue)).then(result =>
    db.collection('issues').find({ _id: result.insertedId }).limit(1)
    .next()
  )
  .then(savedIssue => {
    res.json(savedIssue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  });
});

app.get('/api/issues/:id', (req, res) => {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issueID format: ${error}` });
    return;
  }

  db.collection('issues').find({ _id: issueId }).limit(1)
  .next()
  .then(issue => {
    if (!issue) {
      res.status(404).json({ message: `No such issue: ${issueId}` });
    } else {
      res.json(issue);
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('static/index.html'));
});

app.put('/api/issues/:id', (req, res) => {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issueID format: ${error}` });
  }
  const issue = req.body;
  delete issue._id;

  const err = Issue.validateIssue(issue);
  if (err) {
    res.status(422).json({ message: `Invalid request ${err}` });
    return;
  }

  // same phenomenon with the no brackets...
  db.collection('issues').update({ _id: issueId }, Issue.convertIssue(issue)).then(() =>
    db.collection('issues').find({ _id: issueId }).limit(1)
    .next()
  )
  .then(savedIssue => {
    res.json(savedIssue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});

MongoClient.connect('mongodb://localhost/issuetracker')
.then(connection => {
  db = connection;
  app.listen(3000, () => {
    console.log('App started on port 3000');
  });
})
.catch(error => {
  console.log('ERROR:', error);
});
