import { useEffect, useState } from "react";

import "./App.css";
 
// 임시 혹은 기존 컴포넌트 유지 (구조 맞춤용)

import Header from "./components/Header";

import SearchArea from "./components/SearchArea";

import SlideBox from "./components/SlideBox";
 
function App() {

  const [books, setBooks] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);

  const [sortType, setSortType] = useState("title");

  const [viewMode, setViewMode] = useState("main");
 
  // 폼 및 AI 이미지 관련 상태

  const [formData, setFormData] = useState({

    title: "",

    author: "",

    publisher: "",

    year: "",

    type: "단행본",

    isbn: "",

    description: "",

  });

  // 🚀 새롭게 추가된 AI 이미지 상태

  const [generatedImage, setGeneratedImage] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
 
  // db.json 데이터 불러오기 (GET)

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

    if (sortType === "createdAt") return new Date(b.createdAt) - new Date(a.createdAt);

    return 0;

  });
 
  const holdingBooks = sortedBooks.slice(0, 3);

  const availableBooks = sortedBooks.filter((b) => b.id % 2 !== 0);

  const rentedBooks = sortedBooks.filter((b) => b.id % 2 === 0);
 
  // 도서 삭제

  const handleDeleteBook = (id) => {

    if (window.confirm("정말 삭제하시겠습니까?")) {

      fetch(`http://localhost:3000/books/${id}`, { method: "DELETE" })

        .then((res) => {

          if (res.ok) {

            const updatedBooks = books.filter((book) => book.id !== id);

            setBooks(updatedBooks);

            setSelectedBook(updatedBooks.length > 0 ? updatedBooks[0] : null);

          }

        })

        .catch((err) => console.error("삭제 실패:", err));

    }

  };
 
  // 폼 입력 핸들러

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

  };
 
  // 🚀 AI 이미지 생성 (Mock API) 핸들러

  const handleGenerateImage = () => {

    // 입력된 텍스트 기반 프롬프트를 만든다고 가정

    if (!formData.title) {

      alert("AI가 표지를 디자인할 수 있도록 '도서 제목'을 먼저 입력해주세요.");

      return;

    }
 
    setIsGenerating(true);
 
    // 실제로는 여기에 fetch('https://api.openai.com/v1/images/generations', {...}) 등이 들어갑니다.

    // 여기서는 setTimeout을 이용해 1.5초 뒤에 가상의 랜덤 이미지를 반환하도록 시뮬레이션 합니다.

    setTimeout(() => {

      const randomSeed = Math.floor(Math.random() * 1000);

      // Lorem Picsum을 이용한 가상 이미지 생성

      const mockImageUrl = `https://picsum.photos/seed/${randomSeed}/400/600`;

      setGeneratedImage(mockImageUrl);

      setIsGenerating(false);

    }, 1500);

  };
 
  // 도서 등록 (POST) 연동 로직

  const handleFormSubmit = (e) => {

    e.preventDefault();
 
    if (!formData.title || !formData.author || !formData.publisher) {

      alert("도서 제목, 저자, 출판사는 필수 입력 항목입니다.");

      return;

    }
 
    const newBookData = {

      ...formData,

      year: Number(formData.year) || new Date().getFullYear(),

      createdAt: new Date().toISOString(),

      coverUrl: generatedImage // 생성된 이미지가 있다면 DB에 함께 저장

    };
 
    fetch("http://localhost:3000/books", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(newBookData),

    })

      .then((res) => {

        if (!res.ok) throw new Error("서버 저장 실패");

        return res.json();

      })

      .then((savedBook) => {

        alert("도서가 db.json에 성공적으로 저장되었습니다!");

        setBooks((prevBooks) => [...prevBooks, savedBook]);

        setSelectedBook(savedBook);

        // 입력 폼 및 이미지 초기화

        setFormData({ title: "", author: "", publisher: "", year: "", type: "단행본", isbn: "", description: "" });

        setGeneratedImage(null); 

        setViewMode("main");

      })

      .catch((err) => {

        console.error("도서 추가 실패:", err);

        alert("데이터베이스 저장에 실패했습니다. json-server를 확인하세요.");

      });

  };
 
  return (
<div style={styles.appContainer}>

      {/* ------------------------------------------------------------- */}

      {/* 화면 1: 메인 도서 관리 화면 (기존과 동일)                        */}

      {/* ------------------------------------------------------------- */}

      {viewMode === "main" && (
<div style={styles.mainWrapper}>
<aside style={styles.sidebar}>
<div style={styles.logoArea}>
<span style={{ fontSize: "28px" }}>🤖</span>
<h1 style={styles.logoTitle}>AI 도서관리 시스템</h1>
</div>
<nav style={styles.navMenu}>
<div style={styles.navItemActive}><span>🏠</span> 홈</div>
</nav>
<div style={styles.recentBookBox}>
<p style={styles.recentTitle}>최근 등록된 책</p>
<div style={styles.recentCard}>
<div style={styles.recentCover}>The Design of Everyday Things</div>
<div style={styles.progressBar}></div>
</div>
</div>
<div style={styles.profileBox}>
<div style={styles.profileAvatar}>👤</div>
<div>
<p style={styles.profileName}>Guest</p>
<p style={styles.profileRole}>게스트 사용자</p>
</div>
</div>
</aside>
 
          <section style={styles.centerContent}>
<div style={styles.topSearchBarRow}>
<div style={styles.searchContainer}>
<select style={styles.searchSelect}><option>전체</option></select>
<input type="text" placeholder="도서 제목, 저자, 출판사로 검색하세요" style={styles.searchInputField} />
<button style={styles.searchSubmitBtn}>검색</button>
</div>
<button onClick={() => {

                setGeneratedImage(null); // 등록 화면 진입 시 이미지 초기화

                setViewMode("register");

              }} style={styles.globalAddBtn}>

                + 신규 도서 등록하기
</button>
</div>
 
            {books.length === 0 ? (
<div style={styles.noSelect}>불러올 수 있는 도서 데이터가 없습니다.</div>

            ) : (
<div style={styles.shelfContainer}>
<div style={styles.shelfSection}>
<div style={styles.shelfHeader}>
<h3 style={styles.sectionTitle}>소장중인 책</h3>
<span style={styles.seeAll}>전체보기 &rarr;</span>
</div>
<div style={styles.shelfBooksRow}>

                    {holdingBooks.map((book) => (
<BookItem key={book.id} book={book} isSelected={selectedBook?.id === book.id} onClick={() => setSelectedBook(book)} />

                    ))}
</div>
<div style={styles.shelfLine}></div>
</div>
 
                <div style={styles.shelfSection}>
<div style={styles.shelfHeader}>
<h3 style={styles.sectionTitle}>대출가능</h3>
<span style={styles.seeAll}>전체보기 &rarr;</span>
</div>
<div style={styles.shelfBooksRow}>

                    {availableBooks.slice(0, 6).map((book) => (
<BookItem key={book.id} book={book} isSelected={selectedBook?.id === book.id} onClick={() => setSelectedBook(book)} />

                    ))}
</div>
<div style={styles.shelfLine}></div>
</div>
 
                <div style={styles.shelfSection}>
<div style={styles.shelfHeader}>
<h3 style={styles.sectionTitle}>대출 중</h3>
<span style={styles.seeAll}>전체보기 &rarr;</span>
</div>
<div style={styles.shelfBooksRow}>

                    {rentedBooks.slice(0, 6).map((book) => (
<BookItem key={book.id} book={book} isSelected={selectedBook?.id === book.id} onClick={() => setSelectedBook(book)} />

                    ))}
</div>
<div style={styles.shelfLine}></div>
</div>
</div>

            )}
</section>
 
          <aside style={styles.rightSidePanel}>

            {selectedBook ? (
<div style={styles.stickyPanel}>
<div style={styles.panelHeader}>
<h3 style={styles.sectionTitleRight}>상세 정보 및 관리</h3>
<div style={styles.actionBtnGroup}>
<button onClick={() => alert("수정 기능 연동 포인트")} style={styles.editBtn}>수정</button>
<button onClick={() => handleDeleteBook(selectedBook.id)} style={styles.deleteBtn}>삭제</button>
</div>
</div>
 
                <div style={styles.detailCard}>
<h4 style={styles.detailTitle}>📘 {selectedBook.title}</h4>
<table style={styles.detailTable}>
<tbody>
<tr><th style={styles.tableTh}>저자</th><td style={styles.tableTd}>{selectedBook.author}</td></tr>
<tr><th style={styles.tableTh}>출판사</th><td style={styles.tableTd}>{selectedBook.publisher}</td></tr>
<tr><th style={styles.tableTh}>출판년도</th><td style={styles.tableTd}>{selectedBook.year}년</td></tr>
<tr><th style={styles.tableTh}>도서 유형</th><td style={styles.tableTd}>{selectedBook.type || "단행본"}</td></tr>
<tr><th style={styles.tableTh}>ISBN</th><td style={styles.tableTd}>{selectedBook.isbn || "정보 없음"}</td></tr>
</tbody>
</table>
<h5 style={styles.tableTitle}>📍 실시간 현황 테이블</h5>
<table style={styles.statusTable}>
<thead>
<tr><th style={styles.statusTh}>등록번호</th><th style={styles.statusTh}>소장처</th><th style={styles.statusTh}>대출상태</th></tr>
</thead>
<tbody>
<tr>
<td style={styles.statusTd}>BR-00000{selectedBook.id}</td>
<td style={styles.statusTd}>제1자료실 (2층)</td>
<td style={styles.statusTd}>
<span style={selectedBook.id % 2 === 0 ? styles.statusRent : styles.statusOk}>

                            {selectedBook.id % 2 === 0 ? "대출중" : "대출가능"}
</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>

            ) : (
<div style={styles.noSelect}>도서를 선택하면 상세 정보가 표시됩니다.</div>

            )}
</aside>
</div>

      )}
 
      {/* ------------------------------------------------------------- */}

      {/* 화면 2: 새 페이지 도서 등록 폼 인터페이스 (AI 표지 생성 2단 분할)   */}

      {/* ------------------------------------------------------------- */}

      {viewMode === "register" && (
<div style={styles.pageModifier}>
<div style={styles.registerLayout}>

            {/* [좌측 영역] AI 이미지 생성 및 미리보기 */}
<div style={styles.imagePreviewSide}>
<h3 style={styles.previewTitle}>✨ AI 표지 디자인</h3>
<div style={styles.imageBox}>

                {isGenerating ? (
<div style={styles.loadingState}>
<div style={styles.spinner}>⏳</div>
<p>AI가 표지를 디자인하고 있습니다...</p>
</div>

                ) : generatedImage ? (
<img src={generatedImage} alt="AI 생성 표지" style={styles.generatedImg} />

                ) : (
<div style={styles.emptyState}>
<p style={{ margin: 0 }}>도서 정보를 바탕으로<br/>AI가 표지를 만들어줍니다.</p>
</div>

                )}
</div>
<div style={styles.aiActionRow}>

                {/* 이미지가 없으면 '미리보기', 있으면 '이미지 재생성'으로 버튼 텍스트 변경 */}

                {!generatedImage ? (
<button type="button" onClick={handleGenerateImage} style={styles.aiGenerateBtn}>

                    🎨 AI 이미지 미리보기
</button>

                ) : (
<button type="button" onClick={handleGenerateImage} style={styles.aiRegenerateBtn}>

                    🔄 이미지 재생성
</button>

                )}
</div>
</div>
 
            {/* [우측 영역] 기존 텍스트 입력 폼 */}
<div style={styles.formSide}>
<div style={styles.formHeader}>
<h2 style={{ margin: 0, fontSize: "20px", color: "#212529" }}>📝 새 도서 소장 등록</h2>
<button onClick={() => setViewMode("main")} style={styles.cancelBtn}>뒤로 가기</button>
</div>
 
              <form onSubmit={handleFormSubmit} style={styles.formBody}>
<div style={styles.formGroup}>
<label style={styles.label}>도서 제목 *</label>
<input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="도서명을 입력하세요" style={styles.input} required />
</div>
 
                <div style={styles.formRow}>
<div style={{ ...styles.formGroup, flex: 1 }}>
<label style={styles.label}>저자 *</label>
<input type="text" name="author" value={formData.author} onChange={handleInputChange} placeholder="저자명을 입력하세요" style={styles.input} required />
</div>
<div style={{ ...styles.formGroup, flex: 1 }}>
<label style={styles.label}>출판사 *</label>
<input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} placeholder="출판사명을 입력하세요" style={styles.input} required />
</div>
</div>
 
                <div style={styles.formRow}>
<div style={{ ...styles.formGroup, flex: 1 }}>
<label style={styles.label}>출판년도</label>
<input type="number" name="year" value={formData.year} onChange={handleInputChange} placeholder="예: 2026" style={styles.input} />
</div>
<div style={{ ...styles.formGroup, flex: 1 }}>
<label style={styles.label}>도서 유형</label>
<select name="type" value={formData.type} onChange={handleInputChange} style={styles.selectInput}>
<option value="단행본">단행본</option>
<option value="eBook">eBook</option>
<option value="정기간행물">정기간행물</option>
</select>
</div>
</div>
 
                <div style={styles.formGroup}>
<label style={styles.label}>ISBN 번호</label>
<input type="text" name="isbn" value={formData.isbn} onChange={handleInputChange} placeholder="ISBN 13자리 번호를 입력하세요" style={styles.input} />
</div>
 
                <div style={styles.formGroup}>
<label style={styles.label}>도서 요약 설명</label>
<textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="책에 대한 간략한 핵심 소개글을 적어주세요 (AI 표지 생성에 참고됩니다)" style={styles.textarea} rows="4"></textarea>
</div>
 
                <div style={styles.formActionRow}>
<button type="button" onClick={() => setViewMode("main")} style={styles.formCancelBtn}>취소</button>
<button type="submit" style={styles.formSubmitBtn}>도서 추가하기</button>
</div>
</form>
</div>
</div>
</div>

      )}
</div>

  );

}
 
// ----------------------------------------------------

// BookItem 컴포넌트 유지

// ----------------------------------------------------

const BookItem = ({ book, isSelected, onClick }) => {

  const coverBgColors = ["#1a4d6c", "#0b2545", "#226f54", "#8d99ae", "#d90429", "#f4a261"];

  // AI로 생성된 이미지가 있으면 그걸 보여주고, 없으면 색상 커버를 보여줌

  const selectBg = coverBgColors[book.id % coverBgColors.length];
 
  return (
<div style={{ ...styles.bookShelfCard, ...(isSelected ? styles.selectedBookShelfCard : {}) }} onClick={onClick}>

      {book.coverUrl ? (
<img src={book.coverUrl} alt="커버" style={styles.realCoverImage} />

      ) : (
<div style={{ ...styles.bookCoverImage, backgroundColor: selectBg }}>
<div style={styles.bookCoverTitle}>{book.title}</div>
<div style={styles.bookCoverAuthor}>{book.author}</div>
</div>

      )}
</div>

  );

};
 
// ==========================================

// 통합 디자인 스타일시트

// ==========================================

const styles = {

  appContainer: { fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: "#f4f6f9", minHeight: "100vh", boxSizing: "border-box" },

  mainWrapper: { display: "grid", gridTemplateColumns: "240px 1fr 380px", minHeight: "100vh", backgroundColor: "#f8f9fa" },

  // 좌측 사이드바

  sidebar: { backgroundColor: "#ffffff", borderRight: "1px solid #eef1f5", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "32px" },

  logoArea: { display: "flex", alignItems: "center", gap: "10px" },

  logoTitle: { fontSize: "18px", fontWeight: "bold", color: "#2b8a3e", margin: 0 },

  navMenu: { display: "flex", flexDirection: "column", gap: "8px" },

  navItemActive: { padding: "12px 16px", backgroundColor: "#ebfbee", color: "#2b8a3e", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" },

  recentBookBox: { marginTop: "auto", backgroundColor: "#f8f9fa", padding: "12px", borderRadius: "8px" },

  recentTitle: { fontSize: "12px", color: "#495057", fontWeight: "bold", margin: "0 0 10px 0" },

  recentCard: { height: "140px", backgroundColor: "#102a43", color: "#fff", borderRadius: "6px", padding: "12px", fontSize: "13px", fontWeight: "bold", position: "relative" },

  progressBar: { position: "absolute", bottom: "8px", left: "12px", right: "12px", height: "4px", backgroundColor: "#40c057", borderRadius: "2px" },

  profileBox: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #e9ecef", borderRadius: "8px", cursor: "pointer" },

  profileAvatar: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e9ecef", display: "flex", alignItems: "center", justifyContent: "center" },

  profileName: { fontSize: "14px", fontWeight: "bold", margin: 0, color: "#343a40" },

  profileRole: { fontSize: "11px", color: "#868e96", margin: 0 },
 
  // 중앙 콘텐츠

  centerContent: { padding: "30px 40px", overflowY: "auto" },

  topSearchBarRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", gap: "20px" },

  searchContainer: { display: "flex", flex: 1, maxWidth: "800px", backgroundColor: "#ffffff", borderRadius: "30px", padding: "4px 6px", border: "1px solid #dee2e6", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },

  searchSelect: { border: "none", outline: "none", padding: "0 20px", fontSize: "14px", color: "#495057", backgroundColor: "transparent" },

  searchInputField: { flex: 1, border: "none", outline: "none", padding: "10px", fontSize: "14px" },

  searchSubmitBtn: { backgroundColor: "#f1f3f5", border: "none", padding: "0 24px", borderRadius: "20px", fontWeight: "bold", color: "#495057", cursor: "pointer" },

  globalAddBtn: { padding: "12px 24px", backgroundColor: "#08994a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },

  shelfContainer: { display: "flex", flexDirection: "column", gap: "35px" },

  shelfSection: { display: "flex", flexDirection: "column" },

  shelfHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },

  sectionTitle: { fontSize: "16px", fontWeight: "bold", color: "#343a40", margin: 0 },

  seeAll: { fontSize: "13px", color: "#868e96", cursor: "pointer" },

  shelfBooksRow: { display: "flex", gap: "20px", paddingBottom: "4px", overflowX: "auto", alignItems: "flex-end", minHeight: "180px" },

  shelfLine: { height: "8px", backgroundColor: "#e0d0b0", borderRadius: "4px", marginTop: "2px", boxShadow: "0 4px 6px rgba(0,0,0,0.06)" },

  bookShelfCard: { width: "110px", height: "155px", cursor: "pointer", transition: "transform 0.2s ease" },

  selectedBookShelfCard: { transform: "translateY(-10px)" },

  bookCoverImage: { width: "100%", height: "100%", borderRadius: "4px", boxShadow: "3px 6px 12px rgba(0,0,0,0.15)", padding: "12px 8px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#ffffff" },

  realCoverImage: { width: "100%", height: "100%", borderRadius: "4px", boxShadow: "3px 6px 12px rgba(0,0,0,0.15)", objectFit: "cover" },

  bookCoverTitle: { fontSize: "12px", fontWeight: "bold", lineHeight: "1.3", wordBreak: "keep-all" },

  bookCoverAuthor: { fontSize: "9px", opacity: 0.8, textAlign: "right" },
 
  // 우측 상세정보

  rightSidePanel: { backgroundColor: "#ffffff", borderLeft: "1px solid #eef1f5", padding: "30px 24px", display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto" },

  stickyPanel: { backgroundColor: "#ffffff" },

  sectionTitleRight: { fontSize: "16px", fontWeight: "700", color: "#343a40", margin: 0 },

  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },

  actionBtnGroup: { display: "flex", gap: "6px" },

  editBtn: { padding: "6px 14px", backgroundColor: "#ebfbee", color: "#2b8a3e", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" },

  deleteBtn: { padding: "6px 14px", backgroundColor: "#fff5f5", color: "#fa5252", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "13px" },

  detailCard: { display: "flex", flexDirection: "column", gap: "16px" },

  detailTitle: { fontSize: "16px", margin: 0, color: "#212529", fontWeight: "700" },

  detailTable: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },

  tableTh: { padding: "9px 4px", color: "#868e96", width: '80px', borderBottom: "1px solid #f1f3f5", textAlign: "left" },

  tableTd: { padding: "9px 4px", color: "#212529", borderBottom: "1px solid #f1f3f5", fontWeight: "500" },

  tableTitle: { fontSize: "13px", fontWeight: "700", margin: "16px 0 8px 0", color: "#495057" },

  statusTable: { width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "center" },

  statusTh: { padding: "10px", backgroundColor: "#f8f9fa", color: "#495057", borderBottom: "1px solid #dee2e6", fontWeight: "600" },

  statusTd: { padding: "10px", borderBottom: "1px solid #f1f3f5" },

  statusRent: { color: "#fa5252", fontWeight: 'bold', backgroundColor: "#fff5f5", padding: "3px 8px", borderRadius: "4px" },

  statusOk: { color: "#2b8a3e", fontWeight: 'bold', backgroundColor: "#ebfbee", padding: "3px 8px", borderRadius: "4px" },

  noSelect: { border: "2px dashed #dee2e6", padding: "60px 20px", textAlign: "center", color: "#adb5bd", borderRadius: "12px", fontSize: "14px" },
 
  // ==========================================

  // 🚀 등록 폼 레이아웃 수정 (2단 분할)

  // ==========================================

  pageModifier: { padding: "40px 20px", backgroundColor: "#f8f9fa", minHeight: "100vh" },

  registerLayout: { 

    display: "flex", 

    gap: "30px", 

    maxWidth: "900px", 

    margin: "0 auto", 

    alignItems: "stretch" 

  },

  // AI 이미지 생성 구역 (좌측)

  imagePreviewSide: { 

    width: "300px", 

    backgroundColor: "#ffffff", 

    padding: "24px", 

    borderRadius: "12px", 

    border: "1px solid #e9ecef", 

    boxShadow: "0 8px 24px rgba(0,0,0,0.03)",

    display: "flex",

    flexDirection: "column",

    gap: "16px"

  },

  previewTitle: { margin: 0, fontSize: "16px", color: "#212529", fontWeight: "700", textAlign: "center" },

  imageBox: {

    width: "100%", 

    height: "350px", 

    backgroundColor: "#f8f9fa", 

    border: "2px dashed #ced4da", 

    borderRadius: "8px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",

    textAlign: "center"

  },

  emptyState: { color: "#adb5bd", fontSize: "13px", lineHeight: "1.6" },

  loadingState: { display: "flex", flexDirection: "column", alignItems: "center", color: "#495057", fontSize: "13px", gap: "8px" },

  spinner: { fontSize: "24px", animation: "spin 2s linear infinite" },

  generatedImg: { width: "100%", height: "100%", objectFit: "cover" },

  aiActionRow: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" },

  aiGenerateBtn: { padding: "12px", backgroundColor: "#4263eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },

  aiRegenerateBtn: { padding: "12px", backgroundColor: "#e9ecef", color: "#495057", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
 
  // 입력 폼 구역 (우측)

  formSide: { 

    flex: 1, 

    backgroundColor: "#ffffff", 

    padding: "30px", 

    borderRadius: "12px", 

    border: "1px solid #e9ecef", 

    boxShadow: "0 8px 24px rgba(0,0,0,0.03)" 

  },

  formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #dee2e6", paddingBottom: "16px", marginBottom: "24px" },

  cancelBtn: { padding: "6px 12px", backgroundColor: "#f1f3f5", color: "#495057", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },

  formBody: { display: "flex", flexDirection: "column", gap: "16px" },

  formGroup: { display: "flex", flexDirection: "column", gap: "6px" },

  formRow: { display: "flex", gap: "16px" },

  label: { fontSize: "13px", fontWeight: "600", color: "#495057" },

  input: { padding: "10px 14px", border: "1px solid #ced4da", borderRadius: "6px", fontSize: "14px", outline: "none", backgroundColor: "#fff" },

  selectInput: { padding: "10px 14px", border: "1px solid #ced4da", borderRadius: "6px", fontSize: "14px", outline: "none", backgroundColor: "#fff", height: "41px" },

  textarea: { padding: "10px 14px", border: "1px solid #ced4da", borderRadius: "6px", fontSize: "14px", outline: "none", resize: "none", fontFamily: "inherit" },

  formActionRow: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "14px", borderTop: "1px solid #dee2e6", paddingTop: "20px" },

  formCancelBtn: { padding: "10px 20px", backgroundColor: "#e9ecef", color: "#495057", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },

  formSubmitBtn: { padding: "10px 24px", backgroundColor: "#08994a", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }

};
 
export default App;
 