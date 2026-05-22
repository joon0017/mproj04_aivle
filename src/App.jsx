import './App.css';
import BookList from './components/BookList';
import ApiKey from './components/ApiKey';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Index from './Index';
function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const prompt = "책의 커버 이미지를 생성해줘";

  useEffect(() => {
    async function loadBooks() {
      try{
        const res = await fetch("http://localhost:3000/books");
        if (!res.ok) {
          throw new Error(`Failed to load books: ${res.status}`);
        }
        const data = await res.json();
        setBooks(data);        
        // console.log(data);
      }
      catch(err) {
        console.error(err);
        setError("게시글을 불러오지 못했어요");
      }
      finally {
        setLoading(false);
      }
    }
    loadBooks();
    // console.log(books);

  },[]);
  const handleAddBooks = async (newPost) => {
    //TO-DO complete handleAddBooks function
    try{
    }
    catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    //TO-DO complete handleDelete function
    try{
      
    } catch (err){
      console.error(err);
    }
  };

  const handleImage = async(id) => {
    //TO-DO complete handleImage function
    try{
      if (!apiKey.trim()) {
        alert("API Key를 입력하세요.");
        return;
      }

      const book = books.find((b) => b.id === id);
      if (!book) {
        throw new Error(`Book not found: ${id}`);
      }

      const imagePrompt = `${prompt}: title "${book.title}", author "${book.author}", description "${book.content}", style "2d 이미지"`;
      const imageRes = await fetch("/openai/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt: imagePrompt,
          size: "1024x1024",
          quality: "medium",
        }),
      });

      if (!imageRes.ok) {
        const message = await imageRes.text();
        throw new Error(`Failed to create image: ${imageRes.status} ${message}`);
      }

      const imageData = await imageRes.json();
      const base64Image = imageData.data?.[0]?.b64_json;
      if (!base64Image) {
        throw new Error("No image data returned.");
      }

      const coverImageUrl = `data:image/png;base64,${base64Image}`;
      const updateRes = await fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverImageUrl }),
      });

      if (!updateRes.ok) {
        throw new Error(`Failed to save image: ${updateRes.status}`);
      }

      const updatedBook = await updateRes.json();
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? updatedBook : book))
      );

    } catch (err){
      console.error(err);
      alert("이미지 생성에 실패했습니다.");
    }
    
  };

  if(loading){
    return <>
        <Header/>
        <p>불러오는 중...</p>
      </>
  }
  if(error){
    return <>
        <Header/>
        <p>{error}</p>
    </>
  }

  return (
    <>
      {/* <Header/>
      <ApiKey apiKey={apiKey} onApiKeyChange={setApiKey}/>
      <BookList 
        books={books} 
        onCreateImage={handleImage}
        onDelete={handleDelete}
        prompt={prompt} 
      /> */}
      <Index books={books}/>
    </>
  );
}
export default App;
