import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-elements";
import { View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { useDispatch, useSelector } from "react-redux";
import { setUser, getUser } from "./slices/userslice";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const users = [
  { name: "Jeff", uid: "fds8f76dsf" },
  { name: "Sam", uid: "asdf23" },
  { name: "Bob", uid: "fdsf" },
  { name: "Adam", uid: "afsd234" },
];

export default function ({ navigate }) {
  let dispatch = useDispatch();

  return (
    <SafeAreaView>
      <View style={tw`p-5`}>
        <Text style={tw`text-3xl font-bold`}>Login</Text>
      </View>

      <View style={tw`flex items-center mt-10`}>
        {users.map(({ name, uid }) => (
          <Button
            key={uid}
            onPress={async () => {
              let res = await axios.post("http://localhost:8080/jwt", { uid });
              let jwt = res.data;
              dispatch(setUser({ name, uid, jwt }));
            }}
            title={name}
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
