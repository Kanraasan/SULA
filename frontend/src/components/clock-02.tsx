import * as React from "react";

export default function Clock() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, "0");

  const wibTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const hours = formatTime(wibTime.getHours())
  const minutes = formatTime(wibTime.getMinutes());
  const seconds = formatTime(wibTime.getSeconds());

  return (
    <div className="flex items-center justify-center rounded-lg border bg-card p-3 shadow-sm">
      <span className="text-sm font-semibold tracking-wide">
        {hours}:{minutes}:{seconds} WIB
      </span>
    </div>
  );
}
