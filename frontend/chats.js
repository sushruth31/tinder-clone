import { Button, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./slices/userslice";
import { TextInput, View } from "react-native";
import { ScrollView } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import tw from "./tw";
import { useEffect, useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { MESSAGESBYUSER, MESSAGESBYUSERSUB } from "./gql";

export default function ({ navigate }) {
  let dispatch = useDispatch();
  let { uid } = useSelector(getUser);
  let [searchText, setSearchText] = useState("");
  let { data, loading, error } = useSubscription(MESSAGESBYUSERSUB, {
    variables: { uid },
  });

  useEffect(() => console.log(data, error), [data, error]);

  function includes(word, str) {
    return word.toLowerCase().includes(str.toLowerCase());
  }

  let messageData = [
    { id: Math.random(), message: "Sup dude", userFrom: "Bob", uidTo: "fds8f76dsf", date: new Date().getTime() },
    { id: Math.random(), message: "Yoooo", userFrom: "Jeff", uidTo: "fds8f76dsf", date: new Date().getTime() },
    { id: Math.random(), message: "Hello there", userFrom: "James", uidTo: "fds8f76dsf", date: new Date().getTime() },
    { id: Math.random(), message: "Sup dude", userFrom: "John", uidTo: "fds8f76dsf", date: new Date().getTime() },
    { id: Math.random(), message: "Sup dude", userFrom: "Adam", uidTo: "fds8f76dsf", date: new Date().getTime() },
    { id: Math.random(), message: "Sup dude", userFrom: "Sam", uidTo: "fds8f76dsf", date: new Date().getTime() },
    { id: Math.random(), message: "Sup dude", userFrom: "Billy", uidTo: "fds8f76dsf", date: new Date().getTime() },
  ]
    .filter(({ uidTo }) => uidTo === uid)
    .sort((a, b) => b.date - a.date);

  function Message({ message, date, userFrom }) {
    return (
      <ListItem.Swipeable
        rightContent={
          <Button
            title="Delete"
            icon={{ name: "delete", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
          />
        }
        bottomDivider>
        <View>
          <View style={tw(`flex items-center justify-center rounded-3xl bg-gray-500 h-10 w-10`)}>
            <Text style={tw(`text-white`)}>{userFrom[0]}</Text>
          </View>
        </View>
        <ListItem.Content>
          <ListItem.Title style={tw("font-bold")}>{userFrom}</ListItem.Title>
          <ListItem.Subtitle>{message}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem.Swipeable>
    );
  }

  return (
    <ScrollView>
      <TextInput
        onChangeText={text => setSearchText(text)}
        style={tw(`m-2 border border-gray-500 p-3 rounded-2xl`)}
        placeholder="Search"
        value={searchText}
      />
      <View>
        {[...messageData]
          .filter(({ message, userFrom }) => includes(userFrom, searchText) || includes(message, searchText))
          .map(item => (
            <Message key={item.id} {...item} />
          ))}
      </View>
    </ScrollView>
  );
}
