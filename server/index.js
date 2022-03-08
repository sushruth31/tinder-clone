const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 8080;
require("dotenv").config();
const jwtkey = process.env.JWTKEY;

app.use(express.json());

app.post("/jwt", (req, res) => {
  let { uid } = req.body;

  let token = jwt.sign(
    {
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin", "user"],
        "x-hasura-default-role": "admin",
        "x-hasura-user-id": uid,
      },
    },
    jwtkey
  );

  res.send(token);
});

app.listen(port, () => console.log("server on port 8080"));
