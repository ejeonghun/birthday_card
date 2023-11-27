import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route,Link } from "react-router-dom";
import NewPost from './NewPost';
import Post from './Post';
import main_img from './main.webp';
import './App.css'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function HomePage() {
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState({ nickname: "", reply_content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostAndReplies() {
      const { data: postData, error: postError } = await supabase
        .from("post")
        .select("*")
        .eq("id", "51bd34dd-8dee-4216-bdef-d2d346d0c4e2");

      if (postError) {
        console.error("Error fetching post:", postError);
        return;
      }

      const { data: replyData, error: replyError } = await supabase
        .from("reply")
        .select("*")
        .eq("post_id", "51bd34dd-8dee-4216-bdef-d2d346d0c4e2");

      if (replyError) {
        console.error("Error fetching replies:", replyError);
        return;
      }

      setPost(postData[0]);
      setReplies(replyData);
      setLoading(false);
    }

    fetchPostAndReplies();
  }, []);

  async function handleReplySubmit(e) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("reply")
      .insert([{ ...newReply, post_id: "51bd34dd-8dee-4216-bdef-d2d346d0c4e2" }]);

    if (error) {
      console.error("Error creating new reply:", error);
      return;
    }

    setNewReply({ nickname: "", reply_content: "" });
    window.location.reload();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>No post found</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: 'auto' }}>
      <Link to="/new" style={{ textDecoration: 'none', color: '#fff', backgroundColor: '#007BFF', padding: '10px 20px', borderRadius: '4px', marginBottom: '10px' }}>New Post</Link>
      <img src={main_img} alt="이미지" style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/>
      <h1 style={{ margin: '20px 0 10px 0', textAlign: 'center' }}>{post.title}</h1>
      <p style={{ margin: '10px 0 20px 0', textAlign: 'left' }}>{post.content}</p>
      <div style={{ width: '100%', borderTop: '1px solid #000', padding: '20px', boxSizing: 'border-box' }}>
        <h2>댓글</h2>
        {replies.map((reply) => (
          <div key={reply.id} style={{display:'flex', flexDirection:'row', alignItems:'flex-start', borderBottom: '1px solid #ddd', padding: '10px 0', alignItems:'center'}}>
            <p style={{fontSize:'18px'}} className="m-2 m_b-2"><strong>{reply.nickname}:</strong></p>
            <p style={{fontSize:'16px'}} className="m-2 m_b-2">{reply.reply_content}</p>
          </div>
        ))}
        <form onSubmit={handleReplySubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            value={newReply.nickname}
            onChange={(e) => setNewReply({ ...newReply, nickname: e.target.value })}
            placeholder="닉네임"
            required
            style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            value={newReply.reply_content}
            onChange={(e) => setNewReply({ ...newReply, reply_content: e.target.value })}
            placeholder="내용"
            required
            style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', color: '#fff', backgroundColor: '#007BFF', cursor: 'pointer' }}>댓글 작성</button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<Post/>} />
        <Route path="/new" element={<NewPost />} />
      </Routes>
    </Router>
  );
}

export default App;