import React, { useState, useEffect } from 'react';
import DiaryNote from '../components/Organisms/DiaryNote';
import WellBiengHeadline from '../components/Atoms/WellBiengHeadline';
import ErrorMessage from '../components/Molecules/ErrorMessage';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  getMonth
} from 'date-fns';
import api from '../api';
import NewDiaryNote from '../components/Organisms/NewDiaryNote';

const getColorForRating = (rating) => {
  if (rating === 10) return 'bg-pink-500';
  if (rating >= 8) return 'bg-green-500';
  if (rating >= 5) return 'bg-yellow-300';
  if (rating >= 1) return 'bg-red-500';
  return 'bg-white';
};
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MainPage = () => {
  const [notes, setNotes] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDiaryNote, setShowDiaryNote] = useState(false);
  const [showNewDiaryNote, setShowNewDiaryNote] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const convertToUTCDateWithFourPM = (date) => {
    const utcDate = new Date(date);
    utcDate.setUTCHours(16, 0, 0, 0);
    return utcDate;
  };

  const convertToLocalDateFromUTC = (date) => {
    return new Date(date);
  };

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);

  const days = eachDayOfInterval({
    start: startOfWeek(start),
    end: endOfWeek(end),
  });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (day) => {
    const utcDay = convertToUTCDateWithFourPM(day);
    const note = notes.find(note => isSameDay(note.date, utcDay));
    setSelectedNote(note || { title: '', content: '', rating: 0, date: utcDay });
    setSelectedDate(utcDay);
    setShowDiaryNote(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('https://localhost:7119/api/diarynotes/my');
        const notesData = response.data.map(note => ({
          ...note,
          date: convertToLocalDateFromUTC(parseISO(note.date))
        }));
        setNotes(notesData);

        // Check if there is a diary note for today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time
        const noteForToday = notesData.find(note => isSameDay(note.date, today));
        setShowNewDiaryNote(!noteForToday);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentMonth]);

  const handleSaveNote = async (note) => {
    const noteDate = convertToUTCDateWithFourPM(note.date);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (noteDate > currentDate) {
      setErrorMessage('You cannot create notes for future dates.');
      return;
    } else {
      setErrorMessage('');
    }

    note.date = noteDate.toISOString();
    try {
      if (note.id) {
        await api.put(`https://localhost:7119/api/diarynotes/${note.id}`, note);
      } else {
        await api.post(`https://localhost:7119/api/diarynotes/`, note);
      }

      const response = await api.get('https://localhost:7119/api/diarynotes/my');
      const notesData = response.data.map(note => ({
        ...note,
        date: convertToLocalDateFromUTC(parseISO(note.date))
      }));

      setNotes(notesData);

      // Check if there is a diary note for today again after save
      const today = new Date();
      //today.setHours(0, 0, 0, 0); // Normalize time
      const noteForToday = notesData.find(note => isSameDay(note.date, today));
      setShowNewDiaryNote(!noteForToday);

    } catch (error) {
      console.error('Error saving note:', error);
    }

    setSelectedDate(null);
    setShowDiaryNote(false);
    setShowNewDiaryNote(false);
  };

  return (
    <div className="bg-pink-100 min-h-screen pt-24 relative">
      <div className='w-full flex justify-center mb-16'>
        <WellBiengHeadline />
      </div>
      <div className="bg-white min-w-96 w-4/12 border rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center p-2">
            <h2 className="text-xl font-bold text-pink-600">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className='flex space-x-6'>
              <button onClick={handlePrevMonth} className="font-semibold scale-150 text-pink-600 hover:text-pink-800">
                &lt;
              </button>
              <button onClick={handleNextMonth} className="font-semibold scale-150 text-pink-600 hover:text-pink-800">
                &gt;
              </button>
            </div>
          </div>
          <ul class="grid grid-cols-7 gap-2 justify-center">
            {weekDays.map((weekDay, index) => {
              return <li key={index} className='flex justify-center p-2'>{weekDay}</li>
            })}      
          </ul>
          <div className="grid grid-cols-7 gap-2 justify-center">
            {days.map((day, index) => {
              const utcDay = convertToUTCDateWithFourPM(day);
              const note = notes.find(note => isSameDay(note.date, utcDay));
              const colorClass = note ? getColorForRating(note.rating) : 'bg-white';
              const isCurrentMonth = getMonth(day) === getMonth(currentMonth);
              const dayClass = isCurrentMonth ? '' : 'opacity-40';
              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`p-2 border text-center rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 ${colorClass} ${dayClass}`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        {showNewDiaryNote && (
          <NewDiaryNote onUpdate={handleSaveNote} />
        )}
        {showDiaryNote && selectedNote ? (
          <DiaryNote
            id={selectedNote.id}
            title={selectedNote.title}
            text={selectedNote.text}
            rating={selectedNote.rating}
            onUpdate={handleSaveNote}
            date={selectedDate}
          />
        ) : null}
      </div>
      <ErrorMessage message={errorMessage} />
    </div>
  );
};

export default MainPage;


// import React, { useState, useEffect } from 'react';
// import DiaryNote from '../components/Organisms/DiaryNote';
// import WellBiengHeadline from '../components/Atoms/WellBiengHeadline';
// import ErrorMessage from '../components/Molecules/ErrorMessage';
// import {
//   format,
//   startOfMonth,
//   endOfMonth,
//   eachDayOfInterval,
//   startOfWeek,
//   endOfWeek,
//   isSameDay,
//   addMonths,
//   subMonths,
//   parseISO
// } from 'date-fns';
// import api from '../api';
// import NewDiaryNote from '../components/Organisms/NewDiaryNote';

// const getColorForRating = (rating) => {
//   if (rating === 10) return 'bg-pink-500';
//   if (rating >= 8) return 'bg-green-500';
//   if (rating >= 5) return 'bg-yellow-300';
//   if (rating >= 1) return 'bg-red-500';
//   return 'bg-white';
// };
// const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// const MainPage = () => {
//   const [notes, setNotes] = useState([]);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [showDiaryNote, setShowDiaryNote] = useState(false);
//   const [showNewDiaryNote, setShowNewDiaryNote] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const convertToUTCDateWithFourPM = (date) => {
//     const utcDate = new Date(date);
//     utcDate.setUTCHours(16, 0, 0, 0);
//     return utcDate;
//   };

//   const convertToLocalDateFromUTC = (date) => {
//     return new Date(date);
//   };

//   const start = startOfMonth(currentMonth);
//   const end = endOfMonth(currentMonth);

//   const days = eachDayOfInterval({
//     start: startOfWeek(start),
//     end: endOfWeek(end),
//   });

//   const handlePrevMonth = () => {
//     setCurrentMonth(subMonths(currentMonth, 1));
//   };

//   const handleNextMonth = () => {
//     setCurrentMonth(addMonths(currentMonth, 1));
//   };

//   const handleDayClick = (day) => {
//     const utcDay = convertToUTCDateWithFourPM(day);
//     const note = notes.find(note => isSameDay(note.date, utcDay));
//     setSelectedNote(note || { title: '', content: '', rating: 0, date: utcDay });
//     setSelectedDate(utcDay);
//     setShowDiaryNote(true);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get('https://localhost:7119/api/diarynotes/my');
//         const notesData = response.data.map(note => ({
//           ...note,
//           date: convertToLocalDateFromUTC(parseISO(note.date))
//         }));
//         setNotes(notesData);

//         // Check if there is a diary note for today
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Normalize time
//         const noteForToday = notesData.find(note => isSameDay(note.date, today));
//         setShowNewDiaryNote(!noteForToday);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [currentMonth]);

//   const handleSaveNote = async (note) => {
//     const noteDate = convertToUTCDateWithFourPM(note.date);

//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);

//     if (noteDate > currentDate) {
//       setErrorMessage('You cannot create notes for future dates.');
//       return;
//     } else {
//       setErrorMessage('');
//     }

//     note.date = noteDate.toISOString();
//     try {
//       if (note.id) {
//         await api.put(`https://localhost:7119/api/diarynotes/${note.id}`, note);
//       } else {
//         await api.post(`https://localhost:7119/api/diarynotes/`, note);
//       }

//       const response = await api.get('https://localhost:7119/api/diarynotes/my');
//       const notesData = response.data.map(note => ({
//         ...note,
//         date: convertToLocalDateFromUTC(parseISO(note.date))
//       }));

//       setNotes(notesData);

//       // Check if there is a diary note for today again after save
//       const today = new Date();
//       //today.setHours(0, 0, 0, 0); // Normalize time
//       const noteForToday = notesData.find(note => isSameDay(note.date, today));
//       setShowNewDiaryNote(!noteForToday);

//     } catch (error) {
//       console.error('Error saving note:', error);
//     }

//     setSelectedDate(null);
//     setShowDiaryNote(false);
//     setShowNewDiaryNote(false);
//   };

//   return (
//     <div className="bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400 min-h-screen p-4 relative">
//       <div className='w-full flex justify-center mb-16'>
//         <WellBiengHeadline />
//       </div>
//       <div className="bg-white min w-5/12 border rounded-lg shadow-md p-4">
//           <div className="flex justify-between items-center pt-6 pr-7 pb-2">
//             <h2 className="text-xl font-bold text-pink-600">
//               {format(currentMonth, 'MMMM yyyy')}
//             </h2>
//             <button onClick={handlePrevMonth} className="text-pink-600 hover:text-pink-800">
//               &lt;
//             </button>
//             <button onClick={handleNextMonth} className="text-pink-600 hover:text-pink-800">
//               &gt;
//             </button>
//           </div>
//           <ul class="grid grid-cols-7 gap-2 justify-center">
//             {weekDays.map((weekDay, index) => {
//               return <li key={index} className='flex justify-center p-2'>{weekDay}</li>
//             })}      
//           </ul>
//           <div className="grid grid-cols-7 gap-2 justify-center">
//             {days.map((day, index) => {
//               const utcDay = convertToUTCDateWithFourPM(day);
//               const note = notes.find(note => isSameDay(note.date, utcDay));
//               const colorClass = note ? getColorForRating(note.rating) : 'bg-white';
//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleDayClick(day)}
//                   className={`p-2 border text-center rounded-lg transition-all duration-300 ease-in-out transform hover:scale-110 ${colorClass}`}
//                 >
//                   {format(day, 'd')}
//                 </button>
//               );
//             })}
//           </div>
//         {showNewDiaryNote && (
//           <NewDiaryNote onUpdate={handleSaveNote} />
//         )}
//         {showDiaryNote && selectedNote ? (
//           <DiaryNote
//             id={selectedNote.id}
//             title={selectedNote.title}
//             text={selectedNote.text}
//             rating={selectedNote.rating}
//             onUpdate={handleSaveNote}
//             date={selectedDate}
//           />
//         ) : null}
//       </div>
//       <ErrorMessage message={errorMessage} />
//     </div>
//   );
// };

// export default MainPage;
