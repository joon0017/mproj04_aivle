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
  const [searchTerm, setSearchTerm] = useState("");
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

  const bookMatchesSearch = (book, query) =>
    [
      book.title,
      book.author,
      book.publisher,
      book.type,
      book.isbn,
      book.year,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const searchedBooks = normalizedSearchTerm
    ? sortedBooks.filter((book) => bookMatchesSearch(book, normalizedSearchTerm))
    : sortedBooks;

  const holdingBooks = searchedBooks.slice(0, 3);
  const availableBooks = searchedBooks.filter((book) => book.id % 2 !== 0);
  const rentedBooks = searchedBooks.filter((book) => book.id % 2 === 0);

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

  const handleGenerateImage = async () => {
  if (!formData.title) {
    alert("AI가 표지를 디자인할 수 있도록 도서 제목을 먼저 입력해주세요.");
    return;
  }

  if (!formData.openApiKey) {
    alert("OpenAI API Key를 입력해주세요.");
    return;
  }

  try {
    setIsGenerating(true);

    const prompt = `
도서 제목: ${formData.title}
저자: ${formData.author}
출판사: ${formData.publisher}
도서 설명: ${formData.description}

위 정보를 바탕으로 책 표지 이미지를 만들어줘.
텍스트는 넣지 말고, 세련된 도서 표지 느낌으로 만들어줘.
`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${formData.openApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      alert("이미지 생성 실패: API Key 또는 요청 내용을 확인해주세요.");
      return;
    }

    const imageBase64 = data.data[0].b64_json;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    setGeneratedImage(imageUrl);
  } catch (error) {
    console.error(error);
    alert("이미지 생성 중 오류가 발생했습니다.");
  } finally {
    setIsGenerating(false);
  }
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
    if (selectedBook?.id === book.id) {
      setModalBook(book);
      return;
    }

    setSelectedBook(book);
  };

  const openBookModalByDoubleClick = (book) => {
    setSelectedBook(book);
    setModalBook(book);
  };

  const handleSearchChange = (nextSearchTerm) => {
    setSearchTerm(nextSearchTerm);

    const nextQuery = nextSearchTerm.trim().toLowerCase();
    const nextSearchedBooks = nextQuery
      ? sortedBooks.filter((book) => bookMatchesSearch(book, nextQuery))
      : sortedBooks;

    if (
      nextSearchedBooks.length > 0 &&
      !nextSearchedBooks.some((book) => book.id === selectedBook?.id)
    ) {
      setSelectedBook(nextSearchedBooks[0]);
      return;
    }

    if (nextSearchedBooks.length === 0) {
      setSelectedBook(null);
    }
  };

  return (
    <div className="app-container">
      {viewMode === "main" && (
        <MainPage
          books={searchedBooks}
          totalBooksCount={books.length}
          holdingBooks={holdingBooks}
          availableBooks={availableBooks}
          rentedBooks={rentedBooks}
          selectedBook={selectedBook}
          sortType={sortType}
          onSortChange={setSortType}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onRegisterClick={handleRegisterClick}
          onEditClick={handleEditClick}
          onDeleteBook={handleDeleteBook}
          onBookClick={openBookModal}
          onBookDoubleClick={openBookModalByDoubleClick}
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
