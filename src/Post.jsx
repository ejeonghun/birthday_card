import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { shareKakao } from "./KakaoShare";
import Confetti from 'react-confetti';
import backbtn from './backbtn.svg';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState({nickname: "", reply_content: ""});
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const confettiRef = useRef(null);
 
  setTimeout(() => {
    if (confettiRef.current) {
      confettiRef.current.remove();
    }
  }, 5000);

  useEffect(() => { // 카카오 SDK import
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => { // Post를 가져오는 API
    async function fetchPostAndReplies() {
      const { data: postData, error: postError } = await supabase
        .from("post")
        .select("*")
        .eq("id", id);
        
      if (postError) {
        console.error("Error fetching post:", postError);
        return;
      }

      const { data: replyData, error: replyError } = await supabase
        .from("reply")
        .select("*")
        .eq("post_id" ,id);

      if (replyError) {
        console.error("Error fetching replies:", replyError);
        return;
      }
      setPost(postData[0]);
      setReplies(replyData);
      setLoading(false);
      
    }

    fetchPostAndReplies();
  }, [id]);



  async function handleReplySubmit(e) { // 댓글을 작성하는 API
    e.preventDefault();

    const { data, error } = await supabase
      .from("reply")
      .insert([{ ...newReply, post_id: id }]);

    if (error) {
      console.error("Error creating new reply:", error);
      return;
    }

    setNewReply({nickname: "", reply_content: ""});
    window.location.reload();
  }

  function formatTimestamp(timestamp) { // 날짜를 포맷팅하는 함수
    // timestamp를 Date 객체로 변환합니다.
    const date = new Date(timestamp);
  
    // Intl.DateTimeFormat 객체를 생성합니다.
    // 옵션으로 timeZone을 'Asia/Seoul'로 설정하고, 원하는 날짜와 시간 형식을 지정합니다.
    const formatter = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul'
    });
  
    // 날짜와 시간을 원하는 형식으로 포맷팅합니다.
    const formatted = formatter.format(date);
  
    // 포맷팅된 날짜와 시간을 반환합니다.
    return formatted;
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!post) {
    return <div>No post found</div>
  }


  return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: 'auto' }}>
<div style={{position:'absolute' ,width:'100vw', height:'100vw'}} className="confetti" ref={confettiRef}><Confetti numberOfPieces={200}/></div>
      <Link to="/"><button style={{ position: 'absolute', left: '20px', top: '12px', backgroundColor: 'transparent', border: 'none' }}>
      <img src={backbtn}/></button>
      </Link>
      <h2 style={{margin:'0', marginBlock:'0.2em'}}>{post.name}의 생일카드</h2>
      {post.img_url ? <img src={post.img_url} alt="이미지" style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/> : null}
      <h2 style={{ margin: '20px 0 10px 0', textAlign: 'center' }}>{post.title}</h2>
      <p style={{ margin: '10px 0 20px 0', textAlign: 'left' }}>{post.content}</p>
      <div style={{ width: '100%', borderTop: '1px solid #000', padding: '20px', boxSizing: 'border-box' }}>
        {post ?
        <button onClick={() => shareKakao(window.location.href, post.img_url)} style={{border:'none', padding: 0, background: 'none', cursor: 'pointer', outline: 'none'}}>
        <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="카카오톡 공유" style={{width:'60px', height:'auto'}} />
        <p style={{margin:'0', marginBlock:'0'}}>카카오톡 공유</p>
        </button>
        : ""}

        <h3>메시지</h3>
        {replies.map((reply) => (
  <div key={reply.id} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', borderBottom: '1px solid #ddd', padding: '10px 0', alignItems:'center', backgroundColor: '#f8f8f8', borderRadius: '10px', margin: '10px 0'}}>
  <p style={{fontSize:'18px', color: '#333'}} className="m-2 m_b-2"><strong>{reply.nickname}:</strong></p>
  <p style={{fontSize:'16px', color: '#666'}} className="m-2 m_b-2">{reply.reply_content}</p>
  <p style={{fontSize:'14px', color: '#999'}} className="m-2 m_b-2">{formatTimestamp(reply.created_at)}</p>
</div>
        ))}
<form onSubmit={handleReplySubmit} style={{ display: 'flex', flexDirection: 'column' }}>
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <input
      type="text"
      value={newReply.nickname}
      onChange={(e) => setNewReply({ ...newReply, nickname: e.target.value })}
      placeholder="닉네임"
      required
      style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', width:'25%',marginRight:'5px' }}
    />
    <input
      type="text"
      value={newReply.reply_content}
      onChange={(e) => setNewReply({ ...newReply, reply_content: e.target.value })}
      placeholder="댓글"
      required
      style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', width:'65%' }}
    />
  </div>
  <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', color: '#fff', backgroundColor: '#007BFF', cursor: 'pointer'}}>  
  <span>🎉</span>
  <span>댓글 작성</span></button>
</form>
      </div>
    </div>
  )
}

export default Post
