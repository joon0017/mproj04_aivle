import BookItem from "./BookItem";

function BookList({books, onCreateImage, onDelete}) {
    return <>
        <ul>
            {books.map(b => (
                <BookItem
                    key={b.id}
                    id={b.id}
                    title={b.title}
                    author={b.author}
                    content={b.content}
                    coverImageUrl={b.coverImageUrl==="" ?
                         "https://via.placeholder.com/150" :
                          b.coverImageUrl}
                    onDelete={onDelete}
                    onCreateImage={onCreateImage}
                />
            ))}
        </ul>
    </>
}

export default BookList;