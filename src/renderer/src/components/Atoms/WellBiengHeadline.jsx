import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


function WellBiengHeadline() {
  const naigate = useNavigate()
  const handleClick = () => {
    Cookies.remove("jwt");
    naigate('/');
  }
  return (
    <button
     onClick={handleClick}
     className="text-5xl font-bold text-pink-400 mb-4 lg:text-7xl">Well-being Diary</button>
  )
}

export default WellBiengHeadline