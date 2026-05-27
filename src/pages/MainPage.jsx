import { useEffect, useState } from "react";
import BookDetailsPanel from "../components/BookDetailsPanel";
import ShelfSection from "../components/ShelfSection";

function MainPage({
  books,
  totalBooksCount,
  holdingBooks,
  availableBooks,
  rentedBooks,
  selectedBook,
  sortType,
  onSortChange,
  searchTerm,
  onSearchChange,
  onRegisterClick,
  onEditClick,
  onDeleteBook,
  onBookClick,
  onBookDoubleClick,
}) {
  const [hoveredBook, setHoveredBook] = useState(null);
  const [pendingSearchTerm, setPendingSearchTerm] = useState(searchTerm);
  const displayBook = hoveredBook || selectedBook;
  const isPreviewing = Boolean(
    hoveredBook && hoveredBook.id !== selectedBook?.id
  );
  const hasSearchTerm = searchTerm.trim().length > 0;

  useEffect(() => {
    setPendingSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(pendingSearchTerm);
  };

  return (
    <div className="main-wrapper">
      <aside className="sidebar">
        <div className="logo-area">
          <span className="logo-icon">🤖</span>
          <h1 className="logo-title">AI 도서관리 시스템</h1>
        </div>

        <nav className="nav-menu">
          <div className="nav-item-active">
            <span>🏠</span>
            홈
          </div>
        </nav>

        <div className="recent-book-box">
          <p className="recent-title">최근 등록된 책</p>
          <div className="recent-card">
            <div className="recent-cover">
              {books[books.length - 1]?.title || "The Design of Everyday Things"}
            </div>
            <div className="progress-bar"></div>
          </div>
        </div>

        <div className="profile-box">
          <div className="profile-avatar">👤</div>
          <div>
            <p className="profile-name">Guest</p>
            <p className="profile-role">게스트 사용자</p>
          </div>
        </div>
      </aside>

      <section className="center-content">
        <div className="top-search-bar-row">
          <form
            className="search-container"
            onSubmit={handleSearchSubmit}
          >
            <select
              className="search-select"
              value={sortType}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="정렬 기준"
            >
              <option value="title">제목순</option>
              <option value="author">저자순</option>
              <option value="createdAt">최근 등록순</option>
            </select>

            <input
              type="text"
              placeholder="도서 제목, 저자, 출판사로 검색하세요"
              className="search-input-field"
              value={pendingSearchTerm}
              onChange={(e) => setPendingSearchTerm(e.target.value)}
            />

            <button type="submit" className="search-submit-btn">검색</button>
          </form>

          <button onClick={onRegisterClick} className="global-add-btn">
            + 신규 도서 등록하기
          </button>
        </div>

        {totalBooksCount === 0 ? (
          <div className="no-select">불러올 수 있는 도서 데이터가 없습니다.</div>
        ) : books.length === 0 ? (
          <div className="no-select">
            {hasSearchTerm
              ? `"${searchTerm}" 검색 결과가 없습니다.`
              : "표시할 도서가 없습니다."}
          </div>
        ) : (
          <div className="shelf-container">
            <ShelfSection
              title="소장중인 책"
              books={holdingBooks}
              selectedBook={selectedBook}
              onBookClick={onBookClick}
              onBookDoubleClick={onBookDoubleClick}
              onBookHover={setHoveredBook}
              onBookLeave={() => setHoveredBook(null)}
            />

            <ShelfSection
              title="대출가능"
              books={availableBooks.slice(0, 6)}
              selectedBook={selectedBook}
              onBookClick={onBookClick}
              onBookDoubleClick={onBookDoubleClick}
              onBookHover={setHoveredBook}
              onBookLeave={() => setHoveredBook(null)}
            />

            <ShelfSection
              title="대출 중"
              books={rentedBooks.slice(0, 6)}
              selectedBook={selectedBook}
              onBookClick={onBookClick}
              onBookDoubleClick={onBookDoubleClick}
              onBookHover={setHoveredBook}
              onBookLeave={() => setHoveredBook(null)}
            />
          </div>
        )}
      </section>

      <aside className="right-side-panel">
        <BookDetailsPanel
          selectedBook={displayBook}
          isPreviewing={isPreviewing}
          onEditClick={onEditClick}
          onDeleteBook={onDeleteBook}
        />
      </aside>
    </div>
  );
}

export default MainPage;
