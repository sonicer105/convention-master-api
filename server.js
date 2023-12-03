// Load Config
const config = require('config');
const port = config.get('api.port');

// Check if the user did setup. If port is 0, they didn't do setup.
if(port <= 0) {
  console.log("Port must be greater then 0. Be sure to follow the instructions in the README.md before running.");
  process.exit(12);
}

// Load JWT Secret, or generate if it doesn't exist.
const fs = require('fs');
var secret = "";
try {
  secret = fs.readFileSync('./secret', {encoding: 'utf8', flag: 'r'});
} catch (e) { /* Do Nothing */ }
if(secret.length <= 0) {
  secret = require('crypto').randomBytes(64).toString('hex');
  fs.writeFile('./secret', secret, ()=>{});
}
module.exports = {
  secret: secret
}

// Lead DB
const db = require("./util/db");

// Load Express
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const auth = require("./util/auth");

const app = express();

app.use(morgan("combined")); // Logging
app.use(helmet()); // HTTP Security Headers
app.use(cors()); // CORS Headers

app.use(bodyParser.json()); // Accept JSON Bodies

// Configure Routes
app.use("/lp-api/", require("./routes/user"));
app.use("/lp-api/reports", auth.authenticateToken);
app.use("/lp-api/reports", require("./routes/reports"));

// Configure Swagger API Docs
const specs = swaggerJsdoc({
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Convention Master Unofficial API",
      version: "0.1.0",
      description: `This is a simple REST API for Convention Master application made with Express and documented with
Swagger. This was designed to get some interoperbility between ConventionMaster and third party applications without
requiring additonal dev work by the Convention Master Team.

[Github](https://github.com/sonicer105/convention-master-api)`,
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LinuxPony",
        url: "https://linuxpony.dev/",
        email: "sonic.ert@gmail.com",
      },
    },
    servers: [
      {
        url: config.has("api.serviceUrl") ? config.get("api.serviceUrl") : "http://localhost:" + port + "/lp-api"
      },
    ],
  },
  apis: ["./routes/*.js"],
});
app.use(
  "/lp-api",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// Listen
app.listen(port);
console.debug(`Server listening on port: ${port}`);