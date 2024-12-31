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

  const sound = {
    finishWork: new Audio("/finishWorkWhistle.wav"),
    finishRest: new Audio("/finishRestChime.wav")
  };

  useEffect(() => {
    //残り時間が0の時だけ、処理を行う
    if (remainingTimeMs !== 0) return;

    //稼働中のタイマーを停止する
    clearInterval(timerRef.current);

    // 次のタイマー時間を設定
    const nextTime = isWorkMode ? restTime : workTime;
    setRemainingTimeMs(nextTime);

    // 作業か休憩の終了に応じてチャイムを鳴らす
    const soundToPlay = isWorkMode ? sound.finishWork : sound.finishRest;
    soundToPlay.play();

    //作業フラグを切り替える
    setIsWorkMode((prev) => !prev);

    startTimer();

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