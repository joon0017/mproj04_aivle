import { useEffect, useState } from "react";
import "./App.css";
import BookDetailModal from "./components/BookDetailModal";
import BookFormPage from "./pages/BookFormPage";
import MainPage from "./pages/MainPage";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalBook, setModalBook] = useState(null);
  const [sortType, setSortType] = useState("title");
  const [viewMode, setViewMode] = useState("main");

  const [formData, setFormData] = useState({
    openApiKey: "",
    title: "",
    author: "",
    publisher: "",
    year: "",
    type: "단행본",
    isbn: "",
    description: "",
  });

  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadBooks = () => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setBooks(data);
          setSelectedBook(data[0]);
        }
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const sortedBooks = [...books].sort((a, b) => {
    if (sortType === "title") return a.title.localeCompare(b.title, "ko");
    if (sortType === "author") return a.author.localeCompare(b.author, "ko");
    if (sortType === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const holdingBooks = sortedBooks.slice(0, 3);
  const availableBooks = sortedBooks.filter((book) => book.id % 2 !== 0);
  const rentedBooks = sortedBooks.filter((book) => book.id % 2 === 0);

  const resetForm = () => {
    setFormData({
      openApiKey: "",
      title: "",
      author: "",
      publisher: "",
      year: "",
      type: "단행본",
      isbn: "",
      description: "",
    });

    setGeneratedImage(null);
    setIsGenerating(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenerateImage = () => {
    if (!formData.title) {
      alert("AI가 표지를 디자인할 수 있도록 도서 제목을 먼저 입력해주세요.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const randomSeed = Math.floor(Math.random() * 1000);
      const mockImageUrl = `https://picsum.photos/seed/${randomSeed}/400/600`;

      setGeneratedImage(mockImageUrl);
      setIsGenerating(false);
    }, 1200);
  };

  const handleRegisterClick = () => {
    resetForm();
    setModalBook(null);
    setViewMode("register");
  };

  const handleEditClick = () => {
    if (!selectedBook) return;

    setFormData({
      openApiKey: "",
      title: selectedBook.title || "",
      author: selectedBook.author || "",
      publisher: selectedBook.publisher || "",
      year: selectedBook.year || "",
      type: selectedBook.type || "단행본",
      isbn: selectedBook.isbn || "",
      description: selectedBook.description || "",
    });

    setGeneratedImage(selectedBook.coverUrl || null);
    setModalBook(null);
    setViewMode("edit");
  };

  const handleDeleteBook = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    fetch(`http://localhost:3000/books/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("삭제 실패");

        const updatedBooks = books.filter((book) => book.id !== id);

        setBooks(updatedBooks);
        setSelectedBook(updatedBooks.length > 0 ? updatedBooks[0] : null);
        setModalBook(null);
      })
      .catch((err) => {
        console.error("삭제 실패:", err);
        alert("삭제에 실패했습니다. json-server를 확인하세요.");
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.publisher) {
      alert("도서 제목, 저자, 출판사는 필수 입력 항목입니다.");
      return;
    }

    const newBookData = {
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      year: Number(formData.year) || new Date().getFullYear(),
      type: formData.type,
      isbn: formData.isbn,
      description: formData.description,
      createdAt: new Date().toISOString(),
      coverUrl: generatedImage,
    };

    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBookData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("서버 저장 실패");
        return res.json();
      })
      .then((savedBook) => {
        alert("도서가 db.json에 성공적으로 저장되었습니다.");

        setBooks((prevBooks) => [...prevBooks, savedBook]);
        setSelectedBook(savedBook);
        resetForm();
        setViewMode("main");
      })
      .catch((err) => {
        console.error("도서 추가 실패:", err);
        alert("데이터베이스 저장에 실패했습니다. json-server를 확인하세요.");
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!selectedBook) return;

    if (!formData.title || !formData.author || !formData.publisher) {
      alert("도서 제목, 저자, 출판사는 필수 입력 항목입니다.");
      return;
    }

    const editedBookData = {
      title: formData.title,
      author: formData.author,
      publisher: formData.publisher,
      year: Number(formData.year) || new Date().getFullYear(),
      type: formData.type,
      isbn: formData.isbn,
      description: formData.description,
      coverUrl: generatedImage,
    };

    fetch(`http://localhost:3000/books/${selectedBook.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedBookData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("수정 실패");
        return res.json();
      })
      .then((updatedBook) => {
        alert("도서 정보가 수정되었습니다.");

        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === updatedBook.id ? updatedBook : book
          )
        );

        setSelectedBook(updatedBook);
        resetForm();
        setViewMode("main");
      })
      .catch((err) => {
        console.error("수정 실패:", err);
        alert("도서 정보 수정에 실패했습니다.");
      });
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
    setModalBook(book);
  };

  return (
    <div className="app-container">
      {viewMode === "main" && (
        <MainPage
          books={books}
          holdingBooks={holdingBooks}
          availableBooks={availableBooks}
          rentedBooks={rentedBooks}
          selectedBook={selectedBook}
          sortType={sortType}
          onSortChange={setSortType}
          onRegisterClick={handleRegisterClick}
          onEditClick={handleEditClick}
          onDeleteBook={handleDeleteBook}
          onBookClick={openBookModal}
        />
      )}

      {modalBook && (
        <BookDetailModal book={modalBook} onClose={() => setModalBook(null)} />
      )}

      {viewMode === "register" && (
        <BookFormPage
          mode="register"
          formData={formData}
          generatedImage={generatedImage}
          isGenerating={isGenerating}
          onInputChange={handleInputChange}
          onGenerateImage={handleGenerateImage}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            resetForm();
            setViewMode("main");
          }}
        />
      )}

      {viewMode === "edit" && (
        <BookFormPage
          mode="edit"
          formData={formData}
          generatedImage={generatedImage}
          isGenerating={isGenerating}
          onInputChange={handleInputChange}
          onGenerateImage={handleGenerateImage}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            resetForm();
            setViewMode("main");
          }}
        />
      )}
    </div>
  );
}

export default App;
