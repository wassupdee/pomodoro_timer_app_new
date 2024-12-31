import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const Countdown = () => {

  const workTime = 25 * 60 * 1000;
  const restTime = 5 * 60 * 1000;

  //作業時間（25分）からカウントダウンを始める
  const [remainingTimeMs, setRemainingTimeMs] = useState(workTime);
  const [isWorkMode, setIsWorkMode] = useState(true);
  const timerRef = useRef(0);

  const startTimer = () => {
    const timerId = setInterval(() => {
      setRemainingTimeMs((prev) => prev - 1000)
    }, 1000);
    timerRef.current = timerId;
  };

  const stopTimer = () => {
    clearInterval(timerRef.current)
  };

  const resetTimer = () => {
    clearInterval(timerRef.current)
    setRemainingTimeMs(workTime);
  };

  // const finish_sound = new Audio("/finish_whistle.wav");

  const sound = {
    finishWork: new Audio("/finishWorkWhistle.wav"),
    finishRest: new Audio("/finishRestWhistle.wav")
  };

  useEffect(() => {
    if (remainingTimeMs === 0) {
      finish_sound.play();

      //稼働中のタイマーを停止する
      clearInterval(timerRef.current);

      //次のタイマーの時間を設定する
      const nextTimeMs = isWorkMode ? restTime : workTime;
      setRemainingTimeMs(nextTimeMs);

      //作業フラグを切り替える
      setIsWorkMode((prev) => !prev);

      startTimer();
    };
  },[remainingTimeMs]);

  return (
    <div className="Countdown">
      <p>{ remainingTimeMs }</p>
      <p>{ isWorkMode ? '作業中' : '休憩中' }</p>
      <button onClick={startTimer}>スタート</button>
      <button onClick={stopTimer}>ストップ</button>
      <button onClick={resetTimer}>リセット</button>
    </div>
  );
};

export default Countdown;