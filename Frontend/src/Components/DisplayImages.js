import React, { useState } from 'react';
import axios from 'axios';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function DisplayImages() {
  const [images, setImages] = useState([]);
  
  const fetchImages = () => {
    axios.get('/api/images')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const rearrangedImages = Array.from(images);
    const [reorderedImage] = rearrangedImages.splice(result.source.index, 1);
    rearrangedImages.splice(result.destination.index, 0, reorderedImage);
    setImages(rearrangedImages);
  }

  return (
    <div>
      <button onClick={fetchImages}>Fetch Images</button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image, index) => (
                <Draggable key={image._id} draggableId={image._id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <img src={image.imagePath} alt={image.title} />
                      <div>{image.title}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default DisplayImages;
