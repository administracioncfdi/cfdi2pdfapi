const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');

const cfdi2pdf = require('cfdi2pdf');

const app = express();

app.use(logger('tiny'));
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const VERSION = '2.1.0';

const fonts = {
  Roboto: {
    normal: `/data/_verquire/cfdi2pdf/${VERSION}/node_modules/cfdi2pdf/fonts/Roboto/Roboto-Regular.ttf`,
    bold: `/data/_verquire/cfdi2pdf/${VERSION}/node_modules/cfdi2pdf/fonts/Roboto/Roboto-Medium.ttf`,
    italics: `/data/_verquire/cfdi2pdf/${VERSION}/node_modules/cfdi2pdf/fonts/Roboto/Roboto-Italic.ttf`,
    bolditalics: `/data/_verquire/cfdi2pdf/${VERSION}/node_modules/cfdi2pdf/fonts/Roboto/Roboto-MediumItalic.ttf`,
  },
};

const image = '';

const options = {
  fonts,
  image,
};

// POST
app.post('/pdf', async (req, res) => {
  const { xml } = req.body;
  if (!xml) {
    res.sendStatus(500);
    return;
  }
  const doc = await cfdi2pdf.createPDFServer(xml, options);
  const chunks = [];
  let result;
  doc.on('data', chunk => {
    chunks.push(chunk);
  });
  doc.on('end', () => {
    result = Buffer.concat(chunks);
    const binary = `data:application/pdf;base64,${result.toString('base64')}`;
    res.contentType('application/pdf');
    res.send(binary);
  });
  doc.end();
});

app.use('/mirror', (req, res) => {
  res.status(200).json({
    body: req.body,
    type: typeof req.body,
    isArray: Array.isArray(req.body),
    params: req.params,
    query: req.query,
  });
});

module.exports = app;
