import { Button, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./slices/userslice";
import { SafeAreaView } from "react-native";
import tw from "./tw";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { CARDSQUERY } from "./gql";
import Swiper from "react-native-deck-swiper";

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

  return (
    <SafeAreaView>
      {error ? (
        <Text>Error</Text>
      ) : loading ? (
        <Text>Loading</Text>
      ) : (
        <Swiper
          cards={cards}
          renderCard={(card, index) => (
            <View>
              <Text>Uo</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
