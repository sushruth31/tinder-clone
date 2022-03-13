import { Button, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./slices/userslice";
import { TextInput, View } from "react-native";
import { ScrollView, SafeAreaView } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import tw from "./tw";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { CARDSQUERY } from "./gql";

export default function ({ navigate }) {
  let dispatch = useDispatch();
  let { uid } = useSelector(getUser);
  let [searchText, setSearchText] = useState("");

  let { data, loading, error } = useQuery(CARDSQUERY, {
    variables: { currentuser: uid },
  });

  let [cards, setCards] = useState(data);

  useEffect(() => {
    if (!data) return;
    let { users, swipes } = data;
    //filter out the cards that the user has swiped on
    setCards(users.filter(({ uid }) => !swipes.some(({ uid: swipeuid }) => swipeuid === uid)));
  }, [data]);

  //render an error message if error
  if (error)
    return (
      <SafeAreaView>
        <Text>Something went wrong</Text>
      </SafeAreaView>
    );

  //loading screen

  if (loading)
    return (
      <SafeAreaView>
        <Text>Loading</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView>
      <Text>{JSON.stringify(cards)}</Text>
    </SafeAreaView>
  );
}
