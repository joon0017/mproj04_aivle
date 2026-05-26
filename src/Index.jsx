import { useState } from "react";
import BookItem from "./components/BookItem";
import SearchArea from "./components/SearchArea";
import SlideBox from "./components/SlideBox";

function Index({ books = [] }) {
  const [sortType, setSortType] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3;

  const sortedBooks = [...books].sort((a, b) => {
    if (sortType === "title") {
      return (a.title || "").localeCompare(b.title || "", "ko");
    }

    if (sortType === "author") {
      return (a.author || "").localeCompare(b.author || "", "ko");
    }

    if (sortType === "createdAt") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = sortedBooks.slice(startIndex, startIndex + booksPerPage);

  return (
    <div className="page">
      <main className="content">
        <div className="left-content">
          <SearchArea />

          <section className="book-list">
            {currentBooks.map((book, index) => (
              <BookItem key={book.id} book={book} index={startIndex + index} />
            ))}
          </section>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-arrow"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                {"<"}
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={
                    currentPage === index + 1
                      ? "page-number active"
                      : "page-number"
                  }
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="page-arrow"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div>
          )}
        </div>

        <SlideBox
          books={books}
          sortType={sortType}
          setSortType={setSortType}
        />
      </main>
    </div>
  );
}

export default Index;
