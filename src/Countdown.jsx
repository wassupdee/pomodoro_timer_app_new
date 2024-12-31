import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const Countdown = () => {
  //作業時間25分、休憩時間5分とする
  const workTime = 25 * 60 * 1000;
  const restTime = 5 * 60 * 1000;

  //残り時間を保持する変数
  const [remainingTimeMs, setRemainingTimeMs] = useState(workTime);
  const remainingTimeMins = Math.floor(remainingTimeMs / 1000 / 60);
  const remainingTimeSecs = Math.floor(remainingTimeMs / 1000 % 60);

  //２桁で時間表示する
  const formattedMins = remainingTimeMins < 10 ? "0" + remainingTimeMins : remainingTimeMins;
  const formattedSecs = remainingTimeSecs < 10 ? "0" + remainingTimeSecs : remainingTimeSecs;

  const MODES = {
    INACTIVE: "inactive",
    WORK: "work",
    REST: "rest",
  };
  const [countdownMode, setCountdownMode] = useState(MODES.INACTIVE);

  //カウントダウンタイマーのIDを保持する
  const timerRef = useRef(0);

  //カウントダウン実行中のフラグ(実行中はスタートボタンを無効化するため)
  const [isCountingDown, setIsCountingDown] = useState(false);

  //カウントダウン終了時のチャイム
  const sound = {
    finishWork: new Audio("/finishWorkWhistle.wav"),
    finishRest: new Audio("/finishRestChime.wav")
  };

  //タイマー機能(開始、停止、リセット)
  const startTimer = () => {
    const timerId = setInterval(() => {
      setRemainingTimeMs((prev) => prev - 1000)
    }, 1000);
    timerRef.current = timerId;
    setIsCountingDown(true);
    setCountdownMode((prev) => prev !== MODES.WORK ? MODES.WORK : MODES.REST);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsCountingDown(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current)
    setRemainingTimeMs(workTime);
    setIsCountingDown(false);
    setCountdownMode(MODES.INACTIVE);
  };

  //カウントダウン終了時の処理
  useEffect(() => {
    //残り時間が0の時だけ、処理を行う
    if (remainingTimeMs !== 0) return;

    //稼働中のタイマーを停止する
    clearInterval(timerRef.current);

    // 次のタイマー時間を設定
    const nextTime = countdownMode === MODES.WORK ? restTime : workTime;
    setRemainingTimeMs(nextTime);

    // 作業か休憩の終了に応じてチャイムを鳴らす
    const soundToPlay = countdownMode === MODES.WORK ? sound.finishWork : sound.finishRest;
    soundToPlay.play();

    startTimer();

  },[remainingTimeMs]);

  return (
    <div className="Countdown">
      <p>{ formattedMins } : { formattedSecs  }</p>
      <p>{ isWorkMode ? '作業中' : '休憩中' }</p>
      <button onClick={startTimer} disabled={ isCountingDown }>スタート</button>
      <button onClick={stopTimer}>ストップ</button>
      <button onClick={resetTimer}>リセット</button>
    </div>
  );
};

export default Countdown;