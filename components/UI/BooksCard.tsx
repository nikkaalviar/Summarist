import useAudio from "@/hooks/useAudio";
import { Book } from "@/types";
import BookItem from "./BookItem";

interface Props {
  books: Book[];
}

function BooksCard({ books }: Props) {
  return (
    <div className="recommended--books__container">
      {books.map((book, index) => {
        const audioData = useAudio(book.audioLink || "");

        return <BookItem key={book.id} book={book} audioData={audioData} />;
      })}
    </div>
  );
}

export default BooksCard;
