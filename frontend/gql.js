import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

let uri = "https://gorgeous-lemur-53.hasura.app/v1/graphql";
let wsuri = "wss://gorgeous-lemur-53.hasura.app/v1/graphql";

export function createApolloClient(authToken) {
  return new ApolloClient({
    link: link(authToken),
    cache: new InMemoryCache(),
  });
}

function link(authToken) {
  const getHeaders = () => ({
    Authorization: `Bearer ${authToken}`,
  });

  const wsLink = new WebSocketLink({
    uri: wsuri,
    options: {
      reconnect: true,
      connectionParams: () => {
        return { headers: getHeaders() };
      },
    },
    headers: getHeaders(),
  });

  const httpLink = new HttpLink({ uri, headers: getHeaders() });

  return split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );
}

export const MESSAGESBYUSER = gql`
  query MESSAGEBYUSER($uid: String!) {
    messages(where: { uid: { _eq: $uid } }) {
      message
      messagedate
      messageid
      uid
    }
    messages_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const MESSAGESBYUSERSUB = gql`
  subscription MESSAGESBYUSER($uid: String!) {
    messages(where: { uid: { _eq: $uid } }) {
      message
      messagedate
      messageid
      uid
    }
  }
`;
