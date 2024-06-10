function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center p-24">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-pink-300 mb-4">Well-being Diary</h1>
        <p className="text-lg text-gray-700">Track your well-being and self-care journey</p>
      </header>
      <div className="flex space-x-4">
        <button className="bg-pink-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-pink-600">
          Login
        </button>
        <button className="bg-white text-pink-500 font-semibold py-2 px-4 rounded border border-pink-500 shadow hover:bg-pink-50">
          Register
        </button>
      </div>
    </div>
  )
}

export default App

