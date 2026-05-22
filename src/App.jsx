import './App.css';

import { use, useState } from 'react';
import { useEffect } from 'react';
import Header from './components/Header';
function App() {

  const [books, setPosts] = useState([
    {
      "id": 1,
      "title": "데이터베이스 입문",
      "author": "김철수, 이영희",
      "content": "데이터베이스 기초 개념과 SQL 활용 방법을 설명하는 입문서",
      "coverImageUrl": "",
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": 2,
      "title": "SQL 활용 가이드",
      "author": "박지성",
      "content": "실무 중심의 SQL 활용 예제를 다룬 가이드북",
      "coverImageUrl": "",
      "createdAt": "",
      "updatedAt": ""
    },
    {
      "id": 3,
      "title": "자료구조의 이해",
      "author": "최민수",
      "content": "자료구조와 알고리즘의 기본 원리를 설명하는 교재",
      "coverImageUrl": "",
      "createdAt": "",
      "updatedAt": ""
    },
  ]);
  // const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //TO-DO
    async function loadBooks() {
      //TO-DO complete loadPosts function
      try{
        
      }
      catch(err) {
        console.error(err);
        setError("게시글을 불러오지 못했어요");
      }
        setLoading(false);
    }

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

    } catch (err){
      console.error(err);
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
      <Header/>
      {/* // TO-DO complete the UI */}
    </>
  );
}

export default App;
