import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Container = styled.div`
  width: calc(100vw-10px);
  background-color: #e5989b;
`
const Footer = styled.div`
  display: flex;
`
const Board = styled.div`
  position: relative;
  left: 1000px;
  input {
    display: flex;
    flex-direction: column;
  }
`

export function FAQ() {
  const [formData, setFormData] = useState({
    title: '',
    context: '',
    time: '',
    modiatedDate: '',
    writer: '',
    modifiter: '',
  });

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3301/api/board');
        setPosts(response.data);
      } catch (error) {
        console.error('게시글 불러오기 오류:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3301/api/board', formData);

      setFormData({
        title: '',
        context: '',
        time: '',
        modiatedDate: '',
        writer: '',
        modifiter: '',
      });

      // 게시글을 추가한 후 목록을 다시 불러와서 화면에 갱신
      const response = await axios.get('http://localhost:3301/api/board');
      setPosts(response.data);

      console.log('게시글이 성공적으로 추가되었습니다.');
      alert('게시글 추가 성공');
    } catch (error) {
      console.error('게시글 추가 오류:', error);
    }
  };

  const handleDelete = async (writer) => {
    try {
      await axios.delete(`http://localhost:3301/api/board/${writer}`);

      // 게시글을 삭제한 후 목록을 다시 불러와서 화면에 갱신
      const response = await axios.get('http://localhost:3301/api/board');
      setPosts(response.data);

      console.log('게시글이 성공적으로 삭제되었습니다.');
      alert('게시글 삭제 성공');
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
    }
  };

  return <>
    <Container>
      <main className="main">
        <section>
          <Board>
            <h1>리액트 게시판</h1>
            <form onSubmit={handleSubmit}>
              <label>
                제목:
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
              </label>
              <label>
                내용:
                <textarea name="context" value={formData.context} onChange={handleInputChange} />
              </label>
              {/* 다른 필드들도 위와 같이 추가 */}
              <button type="submit">게시글 추가</button>
            </form>
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <strong>{post.title}</strong>
                  <p>{post.context}</p>
                  <button onClick={() => handleDelete(post.writer)}>삭제</button>
                </li>
              ))}
            </ul>
          </Board>
        </section>
      </main>
      <Footer>
        <ul>
          <li><Link to='https://cocoder.tistory.com' target='_blank'>Blog</Link> </li>
          <li><Link to='https://github.com/hwang-jin-woo/' target='_blank'>Github</Link></li>
        </ul>
        <p>
          <span>저자 : 황진우</span><br />
          <span>이메일 : hjinu91@naver.com</span><br />
          <span>Copyright 2023. copy. All Rights Reserved.</span>
        </p>
      </Footer>
    </Container>
  </>
}
