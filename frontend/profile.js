import { useLayoutEffect } from "react";
import { SafeAreaView, Text } from "react-native";

export default function ({ route, navigation }) {
  let { name } = route.params;

  //update screen title with name

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    <SafeAreaView>
      <Text>{name}</Text>
    </SafeAreaView>
  );
}
