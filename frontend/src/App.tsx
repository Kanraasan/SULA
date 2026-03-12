import { useEffect, useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // ambil url api dari file .env, kalo ga ada default-nya ke /api
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    
    // panggil endpoint hello dari backend
    fetch(`${apiUrl}/hello`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage('Error connecting to backend'));
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Vite + Express</h1>
        <p className="text-xl">Backend says: <span className="font-mono text-blue-600">{message}</span></p>
      </main>
    </div>
  );
}
