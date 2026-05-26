import BookItem from "./BookItem";

function BookList({books}) {
    return <>
        <section className="book-list">
            {books.map((b, index) => (
                <BookItem
                    key={b.id}
                    book={b}
                    index={index}
                />
            ))}
        </section>
    </>
}

export default BookList;
