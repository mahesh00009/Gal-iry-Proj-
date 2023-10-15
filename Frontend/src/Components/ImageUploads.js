import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './ImageUploads.css'
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../Api Request/UserRequests';

const ItemType = 'IMAGE';

function DraggableImage({ image, index, moveImage, handleTitleChange, handleDelete, title }) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div className="image-card" ref={(node) => ref(drop(node))}>
      <img
        src={URL.createObjectURL(image)}
        alt="image"
      />

      <input
        className="title-input"
        type="text"
        placeholder="Image Title"
        value={title}
        onChange={(e) => handleTitleChange(e, index)}
      />
      <button className="delete-button" onClick={() => handleDelete(index)}>X</button>
    </div>
  );
}

function ImageUpload() {
  const [images, setImages] = useState([]);
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate()
  const [storedImages, setStoredImages] = useState([])


  console.log(titles)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setTitles(selectedFiles.map(() => ''));
    e.target.value = '';
  }

  const moveImage = (from, to) => {
    const reorderedImages = [...images];
    reorderedImages.splice(to, 0, reorderedImages.splice(from, 1)[0]);
    setImages(reorderedImages);

    const reorderedTitles = [...titles];
    reorderedTitles.splice(to, 0, reorderedTitles.splice(from, 1)[0]);
    setTitles(reorderedTitles);
  }

  const handleTitleChange = (e, index) => {
    const updatedTitles = [...titles];
    updatedTitles[index] = e.target.value; 
    setTitles(updatedTitles);
  }

  const handleDeleteImage = (index) => {
    const updatedImages = [...images];
    const updatedTitles = [...titles];
    updatedImages.splice(index, 1);
    updatedTitles.splice(index, 1);
    setImages(updatedImages);
    setTitles(updatedTitles);
  }

  const handleUpload = () => {
    const formData = new FormData();
  
    if (images.length === 1) {
      formData.append('images', images[0]);
      formData.append('titles', titles[0]);
    } else if (images.length > 1) {
      images.forEach((image, index) => {
        formData.append('images', image);
        formData.append('titles', titles[index]);
      });
    }
  
    const userToken = localStorage.getItem('user');
  
    axios.post('http://127.0.0.7:5000/uploadImages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => {
        console.log(response?.user?.data?.images);
        console.log(response?.data?.user?.images);
        setStoredImages([...response?.data?.user?.images]);
        setImages([]);
        setTitles([]);
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  

  const handleSignout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  }

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      navigate("/login")
    }else {
      getUserInfo(user)
        .then((res) => {
          setStoredImages(res.data?.user?.images || []);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="image-upload-container">

      <div className="file-input-container">
  <label className="file-input-label">
    Upload Files
    <input type="file" multiple className="file-input" onChange={handleFileChange} />
  </label>
</div>
        <div className='images-container'>
          {images.map((image, index) => (
            <DraggableImage
              key={index}
              index={index}
              image={image}
              title={titles[index]}
              moveImage={moveImage}
              handleTitleChange={handleTitleChange}
              handleDelete={handleDeleteImage}
            />
          ))}

        </div>
       
       <div className='buttons'> 
       <button className="upload-button" onClick={handleUpload} disabled={images.length === 0}>Save</button>

<button className="signout-button" onClick={handleSignout}>Signout</button>
       </div>

        <div>

          <h1>Your Images</h1>
          <hr/>

          <div className="stored-images-container">
            {storedImages.map((imageData, index) => (
              <div key={index} className="stored-image-container">
                <div className="stored-image">
                  <img src={`http://127.0.0.7:5000/${imageData.imageUrl}`} alt={`Stored Image ${index}`} />
                </div>
                <div className="stored-title">
                  <p>{imageData.title}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </DndProvider>
  );
}

export default ImageUpload;
