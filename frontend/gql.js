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
  query Cards($currentuser: String) {
    users(where: { uid: { _neq: $currentuser } }, limit: 10) {
      name
      uid
      username
      photos {
        photourl
        photoid
      }
    }
    swipes(where: { userwhomadeswipe: { _eq: $currentuser } }) {
      userswipedon
    }
  }
`;

export const SWIPE = gql`
  mutation MyMutation($direction: String, $userswipedon: String, $userwhomadeswipe: String) {
    insert_swipes(objects: { direction: $direction, userswipedon: $userswipedon, userwhomadeswipe: $userwhomadeswipe }) {
      returning {
        swipeid
      }
    }
  }
`;

export const CHECKIFMATCH = gql`
  query MyQuery($direction: String, $userwhomadeswipe: String, $userswipedon: String) {
    swipes(
      limit: 1
      where: {
        userwhomadeswipe: { _eq: $userwhomadeswipe }
        userswipedon: { _eq: $userswipedon }
        direction: { _eq: $direction }
      }
    ) {
      swipeid
    }
  }
`;

export const RESETSWIPES = gql`
  mutation MyMutation($userwhomadeswipe: String) {
    delete_swipes(where: { userwhomadeswipe: { _eq: $userwhomadeswipe } }) {
      returning {
        swipeid
      }
    }
  }
`;
