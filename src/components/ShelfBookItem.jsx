const coverBgColors = [
  "#1a4d6c",
  "#0b2545",
  "#226f54",
  "#8d99ae",
  "#d90429",
  "#f4a261",
];

function ShelfBookItem({ book, isSelected, onClick }) {
  const selectBg = coverBgColors[book.id % coverBgColors.length];

  return (
    <button
      type="button"
      className={`book-shelf-card ${isSelected ? "selected-book-shelf-card" : ""}`}
      onClick={onClick}
      aria-label={`${book.title} 상세보기`}
    >
      {book.coverUrl ? (
        <img src={book.coverUrl} alt="커버" className="real-cover-image" />
      ) : (
        <div className="book-cover-image" style={{ backgroundColor: selectBg }}>
          <div className="book-cover-title">{book.title}</div>
          <div className="book-cover-author">{book.author}</div>
        </div>
      )}
    </button>
  );
}

export default ShelfBookItem;
