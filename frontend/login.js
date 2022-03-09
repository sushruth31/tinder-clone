import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-elements";
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setUser, getUser } from "./slices/userslice";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const users = [
  { username: "Jeff", uid: "fds8f76dsf", password: "123" },
  { username: "Sam", uid: "asdf23", password: "124dfs" },
  { username: "Bob", uid: "fdsf", password: "124dfs" },
  { username: "Adam", uid: "afsd234", password: "124dfs" },
];

export default function ({ navigate }) {
  let dispatch = useDispatch();

  async function handleLogin(username, password) {
    //this will return a jwt if successful. pass in the username and pass

    try {
      let res = await axios.post("http://localhost:8080/jwt", { username, password });
      let { uid, jwt } = res.data;
      dispatch(setUser({ username, uid, jwt }));
    } catch (e) {
      console.log(e);
      return;
    }
  }

  return (
    <SafeAreaView>
      <View style={tw`p-5`}>
        <Text style={tw`text-3xl font-bold`}>Login</Text>
      </View>

      <View style={tw`flex items-center mt-10`}>
        {users.map(({ username, uid, password }) => (
          <Button
            key={uid}
            onPress={() => handleLogin(username, password)}
            title={username}
            buttonStyle={{
              backgroundColor: "rgba(78, 116, 289, 1)",
              borderRadius: 3,
            }}
            containerStyle={{
              width: 200,
              marginHorizontal: 50,
              marginVertical: 10,
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
