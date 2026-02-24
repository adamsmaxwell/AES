import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mysql from 'mysql2/promise';


import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Create the pool once per application instance
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'aes',
    password: 'password',
    waitForConnections: true, // Default: true, queues requests if limit reached
    connectionLimit: 10,      // Default: 10, maximum number of connections
    queueLimit: 0             // Default: 0, no limit on queued requests
});

// Function to execute queries on the Job table using the pool
async function queryJobInfo(sqlQuery, jobNoParam) 
{
   var retVal = null;
   try 
   {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute a query
      const [rows, fields] = await connection.execute(
         sqlQuery,
         [jobNoParam]
         );

      if (rows.length > 0) {
         var rowItem = rows[0];
         var jobNo = rowItem.JobNo.trim();
         var coastPN = (rowItem.CoastPN == null) ? "<null>" : rowItem.CoastPN.trim();
         var custPN = (rowItem.CustPN == null) ? "<null>" : rowItem.CustPN.trim();
         // var custPN = "";
         // if (rowItem.CustPN !== null)
         //    custPN = rowItem.CustPN.trim();
         console.log(`queryJobInfo: JobNo: ${jobNo}, CoastPN: ${coastPN}, Cust PN: ${custPN}`);
         retVal = 
         {
            "JobNo": jobNo,
            "CoastPN": coastPN,
            "CustPN": custPN
         };
      }

      // Release the connection back to the pool
      connection.release();
   } 
   catch (err) 
   {
      console.error(err);
   }

   return retVal;
}

app.get('/', (req, res) => {
   res.render('index.ejs');
});

app.get('/home', (req, res) => {
   res.render('index.ejs');
});

app.get('/job-detail', (req, res) => {
      res.render('job-detail.ejs');
   }
);

async function findJob(req,res) {
   const jobNo = req.body["job-no"];

   if ((jobNo != null) && (jobNo != '')) {
      var result = await queryJobInfo('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE JobNo=?', jobNo);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findPrevJob(req,res) {
   const jobNo = req.body["job-no"];

   if ((jobNo != null) && (jobNo != '')) {
      var result = await queryJobInfo(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE JobNo < ? ORDER BY JobNo DESC LIMIT 1',
         jobNo);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findNextJob(req,res) {
   const jobNo = req.body["job-no"];

   if ((jobNo != null) && (jobNo != '')) {
      var result = await queryJobInfo(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE JobNo > ? ORDER BY JobNo ASC LIMIT 1',
         jobNo);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findCoastPN(req,res) {
   const coastPN = req.body["coast-pn"];

   if ((coastPN != null) && (coastPN != '')) {
      var result = await queryJobInfo('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE coastPN = ?', coastPN);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findPrevCoastPN(req,res) {
   const coastPN = req.body["coast-pn"];

   if ((coastPN != null) && (coastPN != '')) {
      var result = await queryJobInfo(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE CoastPN < ? ORDER BY CoastPN DESC LIMIT 1',
         coastPN);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findNextCoastPN(req,res) {
   const coastPN = req.body["coast-pn"];

   if ((coastPN != null) && (coastPN != '')) {
      var result = await queryJobInfo(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE CoastPN > ? ORDER BY CoastPN ASC LIMIT 1',
         coastPN);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findCustPN(req,res) {
   const custPN = req.body["cust-pn"];

   if ((custPN != null) && (custPN != '')) {
      var result = await queryJobInfo('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE CustPN = ?', custPN);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findPrevCustPN(req,res) {
   const custPN = req.body["cust-pn"];

   if ((custPN != null) && (custPN != '')) {
      var result = await queryJobInfo('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE CustPN < ? ORDER BY CustPN DESC LIMIT 1', custPN);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findNextCustPN(req,res) {
   const custPN = req.body["cust-pn"];

   if ((custPN != null) && (custPN != '')) {
      var result = await queryJobInfo('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE CustPN > ? ORDER BY CustPN ASC LIMIT 1', custPN);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};


app.post(
   "/jobdet-search-jobno", 
   (req, res) => 
   {
      const action = req.body["job-search"]; // This will be 'Search', 'Prev' or 'Next'

      if (action === "Search") {
         // Find the specified job
         findJob(req,res);
      } else if (action === "Prev") {
         // Find the previous Job
         findPrevJob(req,res);
      } else if (action === "Next") {
         // Find the next Job
         findNextJob(req,res);
      } else {
         console.log(`Unexpected button press '${action}'`);
      }
   }
);

app.post(
   "/jobdet-search-coastpn", 
   (req, res) => 
   {
      const action = req.body["coastpn-search"]; // This will be 'Search', 'Prev' or 'Next'

      if (action === "Search") {
         // Find the specified Coast PN
         findCoastPN(req,res);
      } else if (action === "Prev") {
         // Find the previous Coast PN
         findPrevCoastPN(req,res);
      } else if (action === "Next") {
         // Find the next Coast PN
         findNextCoastPN(req,res);
      } else {
         console.log(`Unexpected button press '${action}'`);
      }
   }
);

app.post(
   "/jobdet-search-custpn", 
   (req, res) => 
   {
      const action = req.body["custpn-search"]; // This will be 'Search', 'Prev' or 'Next'

      if (action === "Search") {
         // Find the specified Coast PN
         findCustPN(req,res);
      } else if (action === "Prev") {
         // Find the previous Coast PN
         findPrevCustPN(req,res);
      } else if (action === "Next") {
         // Find the next Coast PN
         findNextCustPN(req,res);
      } else {
         console.log(`Unexpected button press '${action}'`);
      }
   }
);

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