import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';

const DiaryNote = ({ id, title, text, rating, onUpdate, date }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');
  const [editedRating, setEditedRating] = useState(0);

  useEffect(() => {
    setEditedTitle(title || '');
    setEditedText(text || '');
    setEditedRating(rating || 0);
  }, [title, text, rating]);

  const clearEditedData = () => {
    setEditedTitle("");
    setEditedText("");
    setEditedRating("");
  }
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    onUpdate({
      id,
      title: editedTitle,
      text: editedText,
      isPublic: false,
      rating: editedRating,
      date,
    });
    clearEditedData();
    setIsEditing(false);
  };

  return (
    <div className="p-4 w-96 border rounded-lg shadow-md bg-white max-w-md lg:mx-24 lg:scale-110 lg">
      {!isEditing ? (
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{editedTitle}</h2>
            <FaPen className="text-gray-500 cursor-pointer" onClick={handleEditClick} />
          </div>
          <p className="mt-2 h-96">{editedText}</p>
          <p className="mt-2">Rating: {editedRating}</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-xl font-bold border rounded px-2 py-1 w-full"
              placeholder="Enter title"
              required
            />
            <FaPen className="text-gray-500 cursor-pointer" onClick={handleSaveClick} />
          </div>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="mt-2 h-72 border rounded w-full px-2 py-1"
            placeholder="Enter text"
            required
          />
          <div className="mt-2">
            <label className="mr-2">Rating:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={editedRating}
              onChange={(e) => setEditedRating(e.target.value)}
              className="border rounded px-2 py-1 w-16"
              required
            />
          </div>
          <button
            onClick={handleSaveClick}
            className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default DiaryNote;