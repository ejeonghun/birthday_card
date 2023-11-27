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

    const { data, error } = await supabase
      .from("post")
      .insert([{ title, content, img_url: imgUrl }]);

    if (error) {
      console.error("Error creating new post:", error);
      return;
    }

    navigate("/");
  }

  async function handleImageUpload(e) {
    const imageFile = e.target.files[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post("https://imgur.wjdgns4019.workers.dev/", formData)
      console.log(response);
      setImgUrl(response.data.data.link);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Content:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <label>
        Upload Image:
        <input type="file" onChange={handleImageUpload} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default NewPost;