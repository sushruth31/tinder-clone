import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CARDSQUERY } from "./gql";
import { getUser } from "./slices/userslice";
import { useDispatch, useSelector } from "react-redux";

export default function useCards() {
  let { uid } = useSelector(getUser);

  let { data, loading, error } = useQuery(CARDSQUERY, {
    variables: { currentuser: uid },
  });

  let [cards, setCards] = useState(data);

  useEffect(() => {
    if (!data) return;

    let { users, swipes } = data;
    //filter out the cards that the user has swiped on
    setCards(users.filter(({ uid }) => !swipes.some(({ userswipedon }) => userswipedon === uid)));
  }, [data]);

  return { cards, setCards, loading, error };
}
