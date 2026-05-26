import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchArea from "./components/SearchArea";
import SlideBox from "./components/SlideBox";
import BookItem from "./components/BookItem";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 3;

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("http://localhost:3000/books");

        if (!res.ok) {
          throw new Error(`Failed to load books: ${res.status}`);
        }

        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

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

  const handlePrevPage = () => {
    if (currentPage === 1) return;
    setCurrentPage((page) => page - 1);
  };

  const handleNextPage = () => {
    if (currentPage === totalPages) return;
    setCurrentPage((page) => page + 1);
  };

  return (
    <div>
      <Header />

      <div className="page">
        <main className="content">
          <div className="left-content">
            <SearchArea />

            {loading && <p className="status-message">Loading books...</p>}
            {error && <p className="status-message">{error}</p>}

            {!loading && !error && (
              <>
                <section className="book-list">
                  {currentBooks.map((book, index) => (
                    <BookItem
                      key={book.id}
                      book={book}
                      index={startIndex + index}
                    />
                  ))}
                </section>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-arrow"
                      onClick={handlePrevPage}
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
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      {">"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <SlideBox
            books={books}
            sortType={sortType}
            setSortType={setSortType}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
