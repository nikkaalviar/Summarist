import Summary from "@/components/UI/Summary";
import AudioPlayer from "@/components/audio/AudioPlayer";
import SearchBar from "@/components/library/SearchBar";
import Sidebar from "@/components/library/Sidebar";
import { initFirebase } from "@/firebase";
import { useSubscription } from "@/hooks/useSubscription";
import { audioPlayerOpen } from "@/redux/audioPlayerSlice";
import { Book } from "@/types";
import requests from "@/utils/requests";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface Props {
  bookSummary: Book | null;
}

function BookAudio({ bookSummary }: Props) {
  const dispatch = useDispatch();

  const app = initFirebase();
  const auth = getAuth(app);
  const subscription = useSubscription(app);

  const [isUserPremium, setUserPremium] = useState(false);
  const [premiumStatusName, setPremiumStatusName] = useState("");

  useEffect(() => {
    const checkPremium = async () => {
      setUserPremium(subscription.isActive);
      setPremiumStatusName(subscription.subscriptionName);
    };

    checkPremium();
  }, [
    app,
    auth.currentUser?.uid,
    subscription.isActive,
    subscription.subscriptionName,
  ]);

  useEffect(() => {
    dispatch(audioPlayerOpen());
  });

  if (bookSummary?.subscriptionRequired && isUserPremium === false) {
    return (window.location.href = "/choose-plan");
  }

  return (
    <div id="foryou">
      <div className="content--wrapper">
        <SearchBar />
        <Sidebar />
        <Summary {...{ bookSummary }} />
        <AudioPlayer book={bookSummary} />
      </div>
    </div>
  );
}

export default BookAudio;

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const { id } = context.query;
  try {
    const bookSummary = (await axios.get(requests.fetchBook(id as string)))
      .data;
    return {
      props: {
        bookSummary,
      },
    };
  } catch (error) {
    console.error("Error fetching book summary:", error);
    return {
      props: {
        bookSummary: null,
      },
    };
  }
}
