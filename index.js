import express from "express";

const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
   res.render('index.ejs');
});

app.get('/home', (req, res) => {
   res.render('index.ejs');
});

app.get('/job-detail', (req, res) => {
   res.render('job-detail.ejs');
});

app.get('/job-matrix', (req, res) => {
   res.render('job-matrix.ejs');
});

app.get('/job-matrix', (req, res) => {
   res.render('job-matrix.ejs');
});

app.get('/cross-ref', (req, res) => {
   res.render('cross-ref.ejs');
});

app.get('/parts-list', (req, res) => {
   res.render('parts-list.ejs');
});

app.get('/suppliers', (req, res) => {
   res.render('suppliers.ejs');
});

app.get('/customers', (req, res) => {
   res.render('customers.ejs');
});

app.get('/materials', (req, res) => {
   res.render('materials.ejs');
});

app.get('/processes', (req, res) => {
   res.render('processes.ejs');
});

app.get('/AS9100', (req, res) => {
   res.render('AS9100.ejs');
});

app.get('/RCAA', (req, res) => {
   res.render('RCAA.ejs');
});

app.get('/doc-change', (req, res) => {
   res.render('doc-change.ejs');
});

app.get('/ref-docs', (req, res) => {
   res.render('ref-docs.ejs');
});

app.get('/records', (req, res) => {
   res.render('records.ejs');
});

app.get('/training', (req, res) => {
   res.render('training.ejs');
});

app.get('/calibration', (req, res) => {
   res.render('calibration.ejs');
});

app.get('/equipment', (req, res) => {
   res.render('equipment.ejs');
});

app.get('/permits', (req, res) => {
   res.render('permits.ejs');
});

app.get('/safety', (req, res) => {
   res.render('safety.ejs');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`AES server listening on port ${port}`);
});