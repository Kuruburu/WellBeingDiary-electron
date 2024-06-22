import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


const WellBiengHeadline = () => {
  const naigate = useNavigate()
  const handleClick = () => {
    Cookies.remove("jwt");
    naigate('/');
  }
  return (
    <button
     onClick={handleClick}
     className="text-5xl font-bold font-handwriting text-pink-600 mb-12 lg:text-7xl">Well-being Diary</button>
  )
}

export default WellBiengHeadline