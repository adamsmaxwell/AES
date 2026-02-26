import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mysql from 'mysql2/promise';
import dotenv  from 'dotenv';

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const mySQLPort = process.env.DB_PORT || 3306;
const port =  process.env.PORT || 3000;

// Create the pool once per application instance
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: mySQLPort,
    waitForConnections: true, // Default: true, queues requests if limit reached
    connectionLimit: 10,      // Default: 10, maximum number of connections
    queueLimit: 0             // Default: 0, no limit on queued requests
});

// Function to execute queries on the Job table using the pool.
// sqlQuery is assumed to have 1 param.
async function queryJobInfoSingle(sqlQuery, jobNoParam) 
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
         console.log(`queryJobInfoSingle: JobNo: ${jobNo}, CoastPN: ${coastPN}, Cust PN: ${custPN}`);
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

// Function to execute queries on the Job table using the pool.
// sqlQuery is assumed to have 2 param2.
async function queryJobInfoDouble(sqlQuery, paramOne, jobNoParam) 
{
   var retVal = null;
   try 
   {
      // Get a connection from the pool
      const connection = await pool.getConnection();

      // Execute a query
      const [rows, fields] = await connection.execute(
         sqlQuery,
         [paramOne, jobNoParam]
         );

      if (rows.length > 0) {
         var rowItem = rows[0];
         var jobNo = rowItem.JobNo.trim();
         var coastPN = (rowItem.CoastPN == null) ? "<null>" : rowItem.CoastPN.trim();
         var custPN = (rowItem.CustPN == null) ? "<null>" : rowItem.CustPN.trim();
         // var custPN = "";
         // if (rowItem.CustPN !== null)
         //    custPN = rowItem.CustPN.trim();
         console.log(`queryJobInfoDouble: JobNo: ${jobNo}, CoastPN: ${coastPN}, Cust PN: ${custPN}`);
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

async function findJob(res, jobNo) {
   if (jobNo != null) {
      var result = await queryJobInfoSingle('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE JobNo >= ? LIMIT 1', jobNo);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findPrevJob(res,jobNo) {
   if (jobNo != null) {
      var result = await queryJobInfoSingle(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE JobNo < ? ORDER BY JobNo DESC LIMIT 1',
         jobNo);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findNextJob(res,jobNo) {
   if (jobNo != null) {
      var result = await queryJobInfoSingle(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE JobNo > ? ORDER BY JobNo ASC LIMIT 1',
         jobNo);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findCoastPN(res, coastPN) {
   if (coastPN != null) {
      var result = await queryJobInfoSingle('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE CoastPN >= ? ORDER BY CoastPN ASC, JobNo ASC LIMIT 1', coastPN);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findPrevCoastPN(res, coastPN, jobNo) {
   if (coastPN != null) {
      var result = await queryJobInfoDouble(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE CoastPN <= ? AND JobNo < ? ORDER BY CoastPN DESC, JobNo DESC LIMIT 1',
         coastPN,
         jobNo);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findNextCoastPN(res, coastPN, jobNo) {
   if (coastPN != null) {
      var result = await queryJobInfoDouble(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE CoastPN >= ? AND JobNo > ? ORDER BY CoastPN ASC, JobNo ASC LIMIT 1',
         coastPN,
         jobNo);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findCustPN(res, custPN) {
   if (custPN != null) {
      var result = await queryJobInfoSingle('SELECT JobNo, CoastPN, CustPN FROM aes.job WHERE CustPN >= ? ORDER BY CoastPN ASC, JobNo ASC LIMIT 1', custPN);
      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

async function findPrevCustPN(res, custPN, jobNo) {
   if (custPN != null) {
      var result = await queryJobInfoDouble(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE CustPN <= ? AND JobNo < ? ORDER BY CustPN DESC, JobNo DESC LIMIT 1',
         custPN,
         jobNo);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};
async function findNextCustPN(res, custPN, jobNo) {
   if (custPN != null) {
      var result = await queryJobInfoDouble(
         'SELECT JobNo, CoastPN, CustPN from aes.job WHERE CustPN >= ? AND JobNo > ? ORDER BY CustPN ASC, JobNo ASC LIMIT 1',
         custPN,
         jobNo);

      if (result != null) {
         res.render('job-detail.ejs', result);
      }
   }   
};

function searchJob(req, res, action, jobNo, coastPN, custPN)
{
   console.log(`searchJob: action: ${action}; Job ${jobNo}; CoastPN: ${coastPN}; CustPN: ${custPN}`);

   switch(action)
   {
      case "Search":
         findJob(res, jobNo);
         break;

      case "Prev":
         findPrevJob(res, jobNo);
         break;

      case "Next":
         findNextJob(res, jobNo);
         break;

      default:
         console.log(`searchJob: Unknown action ${action}`);
         break;
   }
}

function searchCoastPN(req, res, action, jobNo, coastPN, custPN)
{
   console.log(`searchCoastPN: action: ${action}; Job ${jobNo}; CoastPN: ${coastPN}; CustPN: ${custPN}`);

   switch(action)
   {
      case "Search":
         findCoastPN(res, coastPN, jobNo);
         break;

      case "Prev":
         findPrevCoastPN(res, coastPN, jobNo);
         break;

      case "Next":
         findNextCoastPN(res, coastPN, jobNo);
         break;

      default:
         console.log(`searchCoastPN: Unknown action ${action}`);
         break;
   }
}

function searchCustPN(req, res, action, jobNo, coastPN, custPN)
{
   console.log(`searchCustPN: action: ${action}; Job ${jobNo}; CoastPN: ${coastPN}; CustPN: ${custPN}`);

   switch(action)
   {
      case "Search":
         findCustPN(res, custPN, jobNo);
         break;

      case "Prev":
         findPrevCustPN(res, custPN, jobNo);
         break;

      case "Next":
         findNextCustPN(res, custPN, jobNo);
         break;

      default:
         console.log(`searchCustPN: Unknown action ${action}`);
         break;
   }
}

app.post(
   "/jobdet-search-jobno", 
   (req, res) => 
   {
      const jobNo = (req.body["job-no"] == "<null>") ? '' : req.body["job-no"];
      const coastPN = (req.body["coast-pn"] == "<null>") ? '' : req.body["coast-pn"];
      const custPN = (req.body["cust-pn"] == "<null>") ? '' : req.body["cust-pn"];

      var action = req.body["job-search"]; // This will be 'Search', 'Prev' or 'Next'
      if (action !== undefined)
      {
         searchJob(req, res, action, jobNo, coastPN, custPN);
      } 
      else 
      {
         action = req.body["coastpn-search"];
         if (action !== undefined)
         {
            searchCoastPN(req, res, action, jobNo, coastPN, custPN);
         }
         else
         {
            action = req.body["custpn-search"];
            if (action !== undefined)
            {
               searchCustPN(req, res, action, jobNo, coastPN, custPN);
            }
            else
            {
               console.log("Unknown button press");
            }
         }
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