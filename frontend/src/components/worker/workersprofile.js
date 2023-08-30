import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, FormControl, ListGroup, Modal } from 'react-bootstrap';
import { FaThumbsUp, FaComment, FaShare, FaCamera } from 'react-icons/fa';
import './workerdashboard.css';
import { useParams ,Link } from 'react-router-dom';

const WorkerProfile = ({ workerId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [worker, setWorker] = useState(null);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();
  

  useEffect(() => {
    fetchWorker(id)
      .then((data) => {
        // Handle the fetched worker data
      })
      .catch((error) => console.error(error));
  }, [id]);

  const fetchWorker = async (workerId) => {
    try {
      const response = await axios.get(`/api/worker/${workerId}`);
      setWorker(response.data);
    } catch (error) {
      console.error('Error fetching worker:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts?workerId=${workerId}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/like`);
      // Update the like count for the post in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleComment = async (postId) => {
    // Implement logic for handling comments
  };
  
  const handleShare = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/share`);
      // Update the share count for the post in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, shares: post.shares + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };
  
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    setSelectedPhoto(file);
  };
  

  const handlePhotoSubmit = () => {
    // Perform photo submission logic
    // You can send the photo to a server or update the state with the new photo
    // For simplicity, we'll just display the selected photo in the post
    setShowModal(false);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    // Perform post submission logic
    // You can send the post data to the server and update the state with the new post
    // For simplicity, we'll just display the submitted post locally
    const newPost = {
      id: posts.length + 1,
      author: worker.name,
      content: event.target.content.value,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date().toLocaleString(),
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    event.target.reset();
  };

  if (!worker) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center">
            <div className="profile-picture mr-3">
              <img
                src={`/images/${worker.image}`}
                alt="Profile"
                className="rounded-circle"
                width={150}
                height={150}
              />
            </div>
            <div>
              <h3>{worker.name}</h3>
              <p>{worker.jobTitle}</p>
              <p>Followers: {worker.followers}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Form className="mb-4" onSubmit={handlePostSubmit}>
  <FormControl name="content" as="textarea" placeholder="Write something..." />
  <label htmlFor="photo-upload" className="btn btn-light">
    <FaCamera /> Add Photo
    <input
      id="photo-upload"
      type="file"
      accept="image/*"
      onChange={handlePhotoUpload}
      style={{ display: 'none' }}
    />
  </label>

  <Button variant="primary" className="ml-2" type="submit">
    Post
  </Button>
</Form>


<Modal show={showModal} onHide={() => setShowModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Upload Photo</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.File
        id="photo-upload"
        label="Choose a photo"
        accept="image/*"
        onChange={handlePhotoUpload}
      />
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handlePhotoSubmit}>
      Upload
    </Button>
  </Modal.Footer>
</Modal>

      {posts.map((post) => (
        <Card key={post.id} className="mb-3">
          <Card.Body>
            <div className="post-content">
              <p>{post.content}</p>
              {post.photo && (
                <div className="post-image">
                 <img src={`/images/${worker.image}`} alt="Post Photo" />
                </div>
              )}
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="post-actions">
              <Button variant="link" onClick={() => handleLike(post.id)}>
                <FaThumbsUp /> {post.likes}
              </Button>
              <Button variant="link" onClick={() => handleComment(post.id)}>
                <FaComment /> {post.comments}
              </Button>
              <Button variant="link" onClick={() => handleShare(post.id)}>
                <FaShare /> {post.shares}
              </Button>
            </div>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};

export default WorkerProfile;
