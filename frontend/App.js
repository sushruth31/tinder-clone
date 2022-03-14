import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cards from "./chats";
import Login from "./login";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "./slices/userslice";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, Icon, Button } from "react-native-elements";
import tw from "./tw";
import { View } from "react-native";
import ReduxWrapper from "./index";
import { createApolloClient } from "./gql";
import { ApolloProvider } from "@apollo/client";
import { useState } from "react";
import Settings from "./settings";
import Messages from "./messages";

let Stack = createNativeStackNavigator();
let Tab = createBottomTabNavigator();

function ModalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Cards") {
            iconName = "search";
          } else if (route.name === "Settings") {
            iconName = "settings";
          } else if (route.name === "Messages") {
            iconName = "chat";
          }

          return (
            <View>
              <Icon name={iconName} color={color} size={size} />
            </View>
          );
        },
      })}>
      <Tab.Screen name="Cards" component={Cards} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

function AppContentswApollo() {
  let { jwt } = useSelector(getUser);
  let [client] = useState(createApolloClient(jwt));
  let dispatch = useDispatch();

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Group>
            <Stack.Screen
              options={({ navigation, route }) => ({
                headerLeft: () => (
                  <Text style={tw(`pl-4 text-blue-500`)} onPress={() => dispatch(logout())}>
                    Logout
                  </Text>
                ),
                headerRight: () => (
                  <Icon style={tw(`pl-4 text-blue-500`)} onPress={_ => navigation.navigate("NewMessage")} name="edit" />
                ),
                title: "Cards",
              })}
              name="Main"
              component={Home}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen options={{ title: "New Message" }} name="NewMessage" component={ModalScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

function AppContents() {
  let user = useSelector(getUser);

  return user ? <AppContentswApollo /> : <Login />;
}

export default function App() {
  return (
    <ReduxWrapper>
      <AppContents />
    </ReduxWrapper>
  );
}
