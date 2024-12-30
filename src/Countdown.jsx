import { useState } from 'react';

const Countdown = () => {

  //作業時間（25分）からカウントダウンを始める
  const [remainingTimeMs, setRemainingTimeMs] = useState(25 * 60 * 1000);

  const startTimer = () => {
    const timer = setInterval(() => {
      setRemainingTimeMs((prev) => prev - 1000)
    }, 1000);
  };

  const finish_sound = new Audio("/finish_whistle.wav");

  return (
    <div className="Countdown">
      <p>{ remainingTimeMs }</p>
      <button onClick={startTimer}>スタート</button>
    </div>
  );
};

export default Countdown;