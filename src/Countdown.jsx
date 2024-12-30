import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const Countdown = () => {

  //作業時間（25分）からカウントダウンを始める
  const [remainingTimeMs, setRemainingTimeMs] = useState(25 * 60 * 1000);
  const timerRef = useRef(0);

  const startTimer = () => {
    const timerId = setInterval(() => {
      setRemainingTimeMs((prev) => prev - 1000)
    }, 1000);
    timerRef.current = timerId;
  };

  const finish_sound = new Audio("/finish_whistle.wav");

  useEffect(() => {
    if (remainingTimeMs === 0) {
      finish_sound.play();
    };
  },[remainingTimeMs]);

  return (
    <div className="Countdown">
      <p>{ remainingTimeMs }</p>
      <button onClick={startTimer}>スタート</button>
    </div>
  );
};

export default Countdown;