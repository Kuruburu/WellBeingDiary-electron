import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./components/Organisms/Login";
import Register from "./components/Organisms/Register";
import MainPage from "./pages/MainPage";

function App() {
  //const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const router = createBrowserRouter([
    {path: "/", element: <Home />}, 
    {path: '/login', element: <Login />},
    {path: '/register', element: <Register />},
    {path: '/main', element: <MainPage />},
  ])
  return <RouterProvider router={router} />;
  
}

export default App

