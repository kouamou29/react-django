import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRef } from 'react';
import Profil from './Profil';

export default function PostList() {
  const formRef = useRef(null)
    const [post, setPost]= useState([]);
    const [name, setName]= useState('');
    const[text, setText]=  useState('');
    const [image, setImage]=useState(null);
    const [editPostId, setEditPostId]=  useState(null)
  
   
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
    

  useEffect(()=>{
      fetchPosts();
  }, [])

  //get api frond
  const fetchPosts = async()=>{
    try {
        const response= await  axios.get('http://localhost:8000/api/v1/post/')
     
        setPost(response.data)
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
  }


  //creapostpai

   async function handleSubmitPost(e){
        e.preventDefault();
        let data = new FormData();
        data.append('name', name);
        data.append('text', text);
        data.append('image', image);
       try {
        await  axios.post('http://localhost:8000/api/v1/post/', data, {
          headers:{
           'Content-Type':'multipart/form-data'
          }
     })
       } catch (error) {
          console.error('Error fetching posts:', error);
       }
        fetchPosts();
        formRef.current.reset();
       
   }

  async function hanladeUpdate(postId){
    
    let data = new FormData();
    data.append('name', name);
    data.append('text', text);
    if (image) {
      data.append('image', image);
    }
      try {
        axios.put(`http://localhost:8000/api/v1/post/${postId}/`, data, {
          headers:{
            'Content-Type':'multipart/form-data'
           }
       
        })
      setName('');
      setText('');
      setImage(null);
      setEditPostId(null);
      formRef.current.reset();
      fetchPosts();
      } catch (error) {
         console.log(error, 'upate')
      }
    }
 
   const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/post/${postId}/`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };


  const handleEditPost = (posts) => {
    setName(posts.name);
    setText(posts.text);
    setImage(null); // Laissez l'image vide pour l'édition
    setEditPostId(posts.id);
  };
  

  return (
    <div>
   


       <form ref={formRef} onSubmit={editPostId? ()=> hanladeUpdate(editPostId):handleSubmitPost}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" required></textarea >
                <input type="file" onChange={(e) => setImage(e.target.files[0])} required />
                <button type="submit">
                  {editPostId? 'update':'create post'}
                </button>
            </form>

        <ul>
            {post.map(posts =>(
                <li key={posts.id}>
                  <p>{posts.name}</p>
                   <p> {posts.text} </p>
                   {posts.image && <img src={posts.image}  style={{ maxWidth: '200px' }} />}
                    <p>Created at: {formatDate(posts.created_at)}</p>
                    <p>Updated at: {formatDate(posts.updated_at )}</p>
                    <button onClick={()=> handleDeletePost(posts.id)}>Delete</button>
                    <button onClick={()=> handleEditPost(posts)}>Edit</button>
                </li>
            ))}
        </ul>

    
    </div>
  )
}
