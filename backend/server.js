const express = require('express');
let app = express();
const router = require('./routes/route');

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const HTTP_PORT = 8001;

app.use((req, res, next) => { // tirar cors
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    );
    if (req.method === 'OPTIONS') {
      res.send();
    } else {
      next();
    }
  });
  

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

app.use('/api', router);
