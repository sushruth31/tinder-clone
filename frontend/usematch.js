import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CHECKIFMATCH } from "./gql";
import { useSelector } from "react-redux";
import { getUser } from "./slices/userslice";

export default function useMatch(direction, otheruser) {
  let { uid } = useSelector(getUser);
  let { data } = useQuery(CHECKIFMATCH, {
    variables: { direction, userswipedon: uid, userwhomadeswipe: otheruser },
  });

  let [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    if (!data || !direction || direction !== "right" || !otheruser) return;

    let { swipes } = data;

    if (swipes?.length > 0) setIsMatch(true);
  }, [otheruser, data]);

  return isMatch;
}
