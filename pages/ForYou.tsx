import { BsPlayFill } from "react-icons/bs";
import BookCard from "@/components/UI/BookCard";
import SearchBackground from "@/components/library/SearchBackground";
import Sidebar from "@/components/library/Sidebar";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/types";
import Image from "next/image";
import axios from "axios";
import requests from "@/utils/requests";
import { useEffect, useState } from "react";

// interface Props {
//   selectedBook: Book;
//   recommendedBooks: Book[];
//   suggestedBooks: Book[];
// }

// const ForYou = ({ selectedBook, recommendedBooks, suggestedBooks }: Props) => {
const ForYou = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);

  async function fetchBooks() {
    setLoading(true);
    try {
      const selectedBookResponse = (await axios.get(requests.fetchSelectedBook))
        .data[0];
      const recommendedBooksResponse = (
        await axios.get(requests.fetchRecommendedBooks)
      ).data;
      const suggestedBooksResponse = (
        await axios.get(requests.fetchSuggestedBooks)
      ).data;

      setSelectedBook(selectedBookResponse);
      setRecommendedBooks(recommendedBooksResponse);
      setSuggestedBooks(suggestedBooksResponse);

      console.log(selectedBookResponse);
      console.log(recommendedBooksResponse);
      console.log(suggestedBooksResponse);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    return {
      props: {
        selectedBook,
        recommendedBooks,
        suggestedBooks,
      },
    };
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    // !loading && (
    <div id="foryou">
      <div className="content--wrapper">
        <SearchBackground />
        <div className="sidebar__overlay sidebar__overlay--hidden"></div>

        <Sidebar />
        <div className="row">
          <div className="container">
            <div className="selected__book__container">
              <div className="section__header__title">
                Selected just for you
              </div>
              <audio src=""></audio>
              <a href="" className="selected__book">
                <div className="selected__book--subtitle">
                  {selectedBook?.subTitle}
                </div>
                <div className="selected__book--separator"></div>
                <div className="selected__book--content">
                  <figure className="selected--book__image--wrapper">
                    <img
                      src={selectedBook?.imageLink}
                      alt="Book"
                      className="book__img"
                    />
                  </figure>
                  <div className="selected__book--info">
                    <div className="selected__book--title">
                      {selectedBook?.title}
                    </div>
                    <div className="selected__book--author">
                      {selectedBook?.author}
                    </div>
                    <div className="selected__book--audio-wrapper">
                      <div className="selected__book--icon">
                        <BsPlayFill className="play--icon" />
                      </div>
                      <div className="selected__book--duration">
                        1 mins 30 secs
                      </div>
                    </div>
                  </div>
                </div>
              </a>
              <div>
                <div className="section__header__title">
                  Recommended For You
                </div>
                <div className="section__header__subtitle">
                  We think you’ll like these
                </div>
                <BookCard />
              </div>
              <div>
                <div className="section__header__title">Suggested Books</div>
                <div className="section__header__subtitle">
                  Browse those books
                </div>
                <BookCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // )
  );
};

export default ForYou;