import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import axios from 'axios';
import image_upload from './image_upload.png';
import Loading_css from './loading.css';
import backbtn from './backbtn.svg';

function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const goBack = () => { // 뒤로가기 버튼
    navigate(-1);
  }

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    async function handleSubmit(e) {
      e.preventDefault();
    
      if (isLoading) {
        alert('이미지 업로드 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      const { error } = await supabase
        .from("post")
        .insert([{ title, content, img_url: imgUrl, name, birthday }]);
    
      if (error) {
        alert("게시글 작성에 실패하였습니다.");
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', margin: 'auto'}}>
<button onClick={goBack} style={{ position: 'absolute', left: '20px', top: '20px', backgroundColor: 'transparent', border: 'none' }}>
<img src={backbtn}/></button>
  <h3 style={{color:'#000000'}}>생일 축하 카드 만들기</h3>
  <form onSubmit={handleSubmit} style={{ width: '90%', marginBottom: '20px'}}>
    <label>
      제목  
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ display: 'block', width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd'}}/>
    </label>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
      <label style={{ width: '45%' }}>
        이름  
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}/>
      </label>
      <label style={{ width: '45%' }}>
        생일  
        <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd' }}/>
      </label>
    </div>
    <label>
      내용  
      <textarea value={content} onChange={(e) => setContent(e.target.value)} style={{ display: 'block', width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ddd', minHeight: '200px', resize:'none'}}/>
    </label>
    <label style={{ position: 'relative' }}>
      이미지 업로드
      <br/>
      <input type="file" onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }}/>
      {isLoading ? <div class="droplet_spinner">
        <div class="droplet"></div>
        <div class="droplet"></div>
        <div class="droplet"></div>
      </div> : <img src={image_upload} alt="img_upload" style={{ width: '10%', height: 'auto', objectFit: 'cover' , border:'3px solid rgb(190 207 255)', borderRadius:'15px'}}/>}
    </label>
    <hr/>
    {imgUrl &&
      <>
      <div className="preview">
        <img src={imgUrl} style={{width:'20%' , height:'auto', borderRadius:'5px'}} alt="preview"/>
      </div>
      </>
    }
    <br/>
    <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', color: '#fff', backgroundColor: 'rgb(122 199 227)', cursor: 'pointer', float:'right'}}>작성</button>
  </form>
    </div>
  );
}

export default NewPost;