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

export const CARDSQUERY = gql`
  query Cards($currentuser: String, $offset: Int) {
    users(limit: 10, offset: $offset, where: { uid: { _neq: $currentuser } }) {
      name
      uid
      username
    }
    photos(where: { uid: { _neq: $currentuser } }) {
      photourl
      uid
    }
    swipes(where: { userwhomadeswipe: { _eq: $currentuser }, direction: { _eq: "left" } }) {
      userswipedon
    }
  }
`;
