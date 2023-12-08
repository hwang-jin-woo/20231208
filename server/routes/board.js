const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital',
});

// 게시글 입력 API
router.post('/', (req, res) => {
  const {
    title,
    context,
    time,
    modiatedDate,
    writer,
    modifiter,
  } = req.body;

  // Prepared Statement를 사용하여 SQL Injection 방지
  const query =
    'INSERT INTO board (title, context, time,modiatedDate,writer,modifiter) VALUES (?, ?, ?, ?, ?, ?)';

  // 쿼리 실행
  db.query(
    query,
    [
      title,
      context,
      time,
      modiatedDate,
      writer,
      modifiter,
    ],
    (err) => {
      if (err) {
        console.error('쿼리 실행 오류:', err);
        res.status(500).send('서버 오류');
      } else {
        res.status(200).send('게시판 등록');
      }
    }
  );
});
// 게시글 목록 조회
router.get('/api/board', (req, res) => {
  db.query('SELECT * FROM board', (err, results) => {
    if (err) {
      console.error('게시글 목록 조회 오류:', err);
      res.status(500).send('게시글 목록 조회 오류');
    } else {
      res.status(200).json(results);
    }
  });
});
//게시판 가져오기
router.get('/', (req, res) => {
  const sql_board = 'SELECT * FROM board';

  db.query(sql_board, (err, results) => {
    if (err) {
      console.error('데이터 가져오기 오류: ' + err.message);
      res.status(500).json({ error: '데이터 가져오기 오류' });
    } else {
      const boardData = results.map((row) => ({
        title: row.title,
        context: row.context,
        time: row.time,
        modiatedDate: row.modiatedDate,
        writer:row.writer,
        modifiter:row.modifiter,
      }));
      res.json(boardData);
    }
  });
});


// 게시글 삭제
router.delete('/api/board/:id', (req, res) => {
  const postId = req.params.id;

  db.query('DELETE FROM board WHERE id = ?', postId, (err, result) => {
    if (err) {
      console.error('게시글 삭제 오류:', err);
      res.status(500).send('게시글 삭제 오류');
    } else {
      res.status(200).send('게시글이 성공적으로 삭제되었습니다.');
    }
  });
});

module.exports = router;




