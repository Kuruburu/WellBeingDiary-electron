import { useState, useEffect } from 'react'

const NewDiaryNote = ( {onUpdate} ) => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)

  useEffect(() => {
    setTitle(title || '')
    setText(text || '')
    setRating(rating || 0)
  }, [title, text, rating])

  const clearData = () => {
    setTitle('')
    setText('')
    setRating('')
  }

  const handleSaveClick = () => {
		const todaysDate = new Date().setHours(0, 0, 0, 0);
    onUpdate({
      title: title,
      text: text,
      isPublic: false,
      rating: rating,
      date: todaysDate
    })
    clearData()
  }
  return (
    <div className="p-4 w-96 border rounded-lg shadow-md bg-white max-w-md lg:mx-24 lg:scale-110 lg">
			<h2 className='flex justify-center font-bold text-xl text-pink-600'>Hi, how was your day ?</h2>
      <div className="flex justify-center items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl text-center font-bold rounded px-2 py-1 w-full"
          placeholder="Enter title"
          required
        />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
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
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border rounded px-2 py-1 w-16"
          required
        />
      </div>
      <button
        onClick={handleSaveClick}
        className="w-full mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg"
      >
        Save
      </button>
    </div>
  )
}

export default NewDiaryNote
