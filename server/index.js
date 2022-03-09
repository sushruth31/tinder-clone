const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 8080;
require("dotenv").config();
const jwtkey = process.env.JWTKEY;
const adminKey = process.env.ADMINKEY;
const gql = require("graphql-tag");
const ApolloClient = require("apollo-client").ApolloClient;
const createHttpLink = require("apollo-link-http").createHttpLink;
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const fetch = require("node-fetch");

const httpLink = createHttpLink({
  uri: "https://gorgeous-lemur-53.hasura.app/v1/graphql",
  headers: { "x-hasura-admin-secret": adminKey },
  fetch,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

//query to get the passed in user
const GETUSERQUERY = gql`
  query GetUser($username: String, $password: String) {
    users(where: { password: { _eq: $password }, username: { _eq: $username } }) {
      uid
    }
  }
`;

app.use(express.json());

app.post("/test", async (req, res) => {
  let response = await client.query({
    query: GETUSERQUERY,
    variables: {
      username: "Jeff",
      password: "123",
    },
  });

  res.json(response);
});

app.post("/jwt", async (req, res) => {
  let { username, password } = req.body;

  let response = await client.query({
    query: GETUSERQUERY,
    variables: {
      username,
      password,
    },
  });

  let user = response?.data?.users?.[0];

  //if there is no user returned send an error code

  if (!user) return res.status(401).send("No auth");

  let uid = user.uid;

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

  res.json({ uid, jwt: token });
});

app.listen(port, () => console.log("server on port 8080"));
