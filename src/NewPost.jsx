import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import axios from 'axios';

function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const navigate = useNavigate();

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function handleSubmit(e) {
      e.preventDefault();
    
      const { error } = await supabase
        .from("post")
        .insert([{ title, content, img_url: imgUrl }]);
    
      if (error) {
        console.error("Error creating new post:", error);
        return;
      }
    
      // 별도의 select 쿼리를 사용하여 방금 삽입된 게시물의 ID를 가져옵니다.
      // 여기서는 제목과 내용을 기반으로 검색하였습니다.
      const { data: postData, error: postError } = await supabase
        .from("post")
        .select("id")
        .eq("title", title)
        .eq("content", content)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
    
      if (postError) {
        console.error("Error fetching new post:", postError);
        return;
      }
    
      if (postData) {
        const newPostId = postData.id;
        navigate(`/post/${newPostId}`);
      } else {
        console.error("The post was not found.");
      }
    }
    

  async function handleImageUpload(e) {
    const imageFile = e.target.files[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post("https://imgur.wjdgns4019.workers.dev/", formData)
      // workers proxy 사용
      console.log(response);
      setImgUrl(response.data.data.link);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: 'auto' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', marginBottom: '20px' }}>
        <label>
          제목 : 
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}/>
        </label>
        <label>
          내용 : 
          <textarea value={content} onChange={(e) => setContent(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', minHeight: '200px' }}/>
        </label>
        <label>
          이미지 업로드
          <input type="file" onChange={handleImageUpload} style={{ display: 'block', margin: '10px 0' }}/>
        </label>
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', color: '#fff', backgroundColor: '#007BFF', cursor: 'pointer' }}>Submit</button>
      </form>
      <div style={{ width: '100%', borderTop: '1px solid #000', padding: '20px', boxSizing: 'border-box' }}>
        <h4>미리보기</h4>
        <img src={imgUrl || 'https://via.placeholder.com/150'} alt="preview" style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/>
        <h2 style={{ margin: '20px 0 10px 0', textAlign: 'center' }}>{title}</h2>
        <p style={{ margin: '10px 0 20px 0', textAlign: 'left' }}>{content}</p>
        <hr/>
        <h3>댓글</h3>
      </div>
    </div>
  );
}

export default NewPost;