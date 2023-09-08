import SummarySkeleton from "@/components/UI/Skeleton/SummarySkeleton";
import Summary from "@/components/UI/Summary";
import SearchBar from "@/components/library/SearchBar";
import Sidebar from "@/components/library/Sidebar";
import { Book } from "@/types";
import requests from "@/utils/requests";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  bookSummary: Book | null;
}

function BookAudio({ bookSummary }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);

  return (
    <div id="foryou">
      <div className="content--wrapper">
        <SearchBar />
        <Sidebar />

        {loading ? <SummarySkeleton /> : <Summary bookSummary={bookSummary} />}
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
