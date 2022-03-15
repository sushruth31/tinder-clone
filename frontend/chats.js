import { Button, Icon, Text } from "react-native-elements";
import { SafeAreaView, View, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import useCards from "./usecards";
import tw from "./tw";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

function Buttons({ card }) {
  let buttons = [
    { name: "close", onClick: () => null },
    { name: "favorite", onClick: () => null },
  ];

  return (
    <View style={tw("w-full flex flex-row items-center justify-center p-4 ")}>
      {buttons.map((props, i) => (
        <Icon key={i} size={40} style={tw("bg-white px-4")} {...props} />
      ))}
    </View>
  );
}

export default function () {
  let { cards, setCards, loading, error } = useCards();
  let [imageLoading, setImageLoading] = useState(false);
  let [cardsempty, setCardsEmpty] = useState(false);
  let navigation = useNavigation();

  return (
    <SafeAreaView>
      {error ? (
        <Text>Error</Text>
      ) : loading || !cards ? (
        <Text>Loading</Text>
      ) : (
        <>
          <View style={tw("flex items-center justify-center w-full")}>
            {cards?.length > 0 ? (
              <Swiper
                cards={cards}
                renderCard={({ uid, photos, name, username }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Profile", { uid, photos, name, username })}
                      key={uid}
                      style={tw(`bg-white p-4 rounded-xl h-3/4 w-full`)}>
                      {imageLoading ? (
                        <Text>Loading</Text>
                      ) : (
                        <Image
                          onLoadStart={() => setImageLoading(true)}
                          onLoadEnd={() => setImageLoading(false)}
                          style={tw("w-full h-3/4 mb-10")}
                          source={{ uri: photos?.[0]?.photourl }}
                        />
                      )}
                      <Text style={tw("w-full h-full text-3xl font-bold ")}>{name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <View>
                <Text>Load more!</Text>
              </View>
            )}
          </View>
          <Buttons />
        </>
      )}
    </SafeAreaView>
  );
}
