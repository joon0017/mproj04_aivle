function ShelfBookItem({
  book,
  isSelected,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const isRented = book.isAvailable === false;

  const fallbackColors = [
    "#64748b",
    "#082f49",
    "#0f766e",
    "#4c1d95",
    "#ea580c",
    "#166534",
    "#be123c",
    "#0f172a",
  ];

  const colorIndex = Number(book.id) % fallbackColors.length;

  return (
    <article
      className={`shelf-book-item ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="shelf-book-cover"
        style={
          book.coverUrl
            ? { backgroundImage: `url(${book.coverUrl})` }
            : { backgroundColor: fallbackColors[colorIndex] }
        }
      >
        {!book.coverUrl && (
          <>
            <h4>{book.title}</h4>
            <span>{book.type || "단행본"}</span>
          </>
        )}
      </div>

      <div className="shelf-book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.publisher}</p>
        <p>{book.year}년</p>

        <span className={isRented ? "status-badge rented" : "status-badge available"}>
          {isRented ? "대출 중" : "대출 가능"}
        </span>
      </div>
    </article>
  );
}

export default ShelfBookItem;