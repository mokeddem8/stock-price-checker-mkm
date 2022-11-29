'use strict';

require('dotenv').config();

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const mongoose    = require('mongoose')
const helmet      = require('helmet')

const mongoURI = process.env.DB;
const port = process.env.PORT || 3000;

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

mongoose.Promise = global.Promise
const dbName = 'stock_price_checker'


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if (error) {
    console.log("Uri: " + mongoURI);
    return console.log("Connection failed !!!!!");
  }

  console.log("Connection established");

  
});

/* Drop the DB-->For making Functional-tests easier  */
//mongoose.connection.dropDatabase(dbName);
     

      // Close MongoDB connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(`Closing connection to ${dbName}`)
    process.exit(0)
  })
})

const app = express();

app.use(helmet())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'"],
      "style-src": ["'self'"],
    },
  })
);

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(port, function () {
  console.log("Listening on port: " + port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        let error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
