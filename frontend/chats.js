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
import { getOffset } from "./slices/cardsslice";

export default function ({ navigate }) {
  let dispatch = useDispatch();
  let { uid } = useSelector(getUser);
  let [searchText, setSearchText] = useState("");

  let { data, loading, error } = useQuery(CARDSQUERY, {
    variables: { currentuser: uid },
  });

  let [organizedData, setOrganizedData] = useState(data);

  useEffect(() => {
    if (!data) return;
    console.log(data);
  }, [data]);

  //render an error message if error
  if (error)
    return (
      <SafeAreaView>
        <Text>Something went wrong</Text>
      </SafeAreaView>
    );

  useEffect(() => console.log(data), [data]);

  return (
    <SafeAreaView>
      <Text>This is the cards page</Text>
    </SafeAreaView>
  );
}
