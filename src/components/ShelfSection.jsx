import ShelfBookItem from "./ShelfBookItem";

function ShelfSection({
  title,
  books = [],
  selectedBook,
  onBookClick,
  onBookDoubleClick,
  onBookHover = () => {},
  onBookLeave = () => {},
}) {
  return (
    <div className="shelf-section">
      {title && (
        <div className="shelf-header">
          <h3 className="section-title">{title}</h3>
          <span className="see-all">전체보기 →</span>
        </div>
      )}

      {books.length === 0 ? (
        <div className="empty-book-area">검색 결과가 없습니다.</div>
      ) : (
        <div className="shelf-books-grid">
          {books.map((book) => (
            <div className="shelf-book-slot" key={book.id}>
              <ShelfBookItem
                book={book}
                isSelected={selectedBook?.id === book.id}
                onClick={() => onBookClick(book)}
                onDoubleClick={() => onBookDoubleClick(book)}
                onMouseEnter={() => onBookHover(book)}
                onMouseLeave={onBookLeave}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShelfSection;