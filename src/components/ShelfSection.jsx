import ShelfBookItem from "./ShelfBookItem";

function ShelfSection({ title, books, selectedBook, onBookClick }) {
  return (
    <div className="shelf-section">
      <div className="shelf-header">
        <h3 className="section-title">{title}</h3>
        <span className="see-all">전체보기 →</span>
      </div>

      <div className="shelf-books-row">
        {books.map((book) => (
          <ShelfBookItem
            key={book.id}
            book={book}
            isSelected={selectedBook?.id === book.id}
            onClick={() => onBookClick(book)}
          />
        ))}
      </div>

      <div className="shelf-line"></div>
    </div>
  );
}

export default ShelfSection;
