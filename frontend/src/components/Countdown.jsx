import { useState, useEffect, useRef } from 'react';
import saveTimerRecord from '../api/SaveTimerRecord';

const Countdown = () => {
  //作業時間25分、休憩時間5分とする
  const workTime = 25 * 60 * 1000;
  const restTime = 5 * 60 * 1000;

  //残り時間を保持する変数
  const [remainingTimeMs, setRemainingTimeMs] = useState(workTime);
  const remainingTimeMins = Math.floor(remainingTimeMs / 1000 / 60);
  const remainingTimeSecs = Math.floor(remainingTimeMs / 1000 % 60);

  //経過時間を保持する変数
  const [workTimeElapsedMs, setWorkTimeElapsedMs] = useState(0);
  const [restTimeElapsedMs, setRestTimeElapsedMs] = useState(0);

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

  const changeMode = () => {
    setCountdownMode(countdownMode === MODES.WORK ? MODES.REST : MODES.WORK)
  };

  //タイマー機能(開始、停止、リセット)
  const startTimer = () => {
    if (countdownMode === MODES.INACTIVE) return;

    setRemainingTimeMs(countdownMode === MODES.WORK ? workTime : restTime)
    const timerId = setInterval(() => {
      setRemainingTimeMs((prev) => prev - 1000);
      countdownMode === MODES.WORK ? setWorkTimeElapsedMs((prev) => prev + 1000) : setRestTimeElapsedMs((prev) => prev + 1000);
    }, 1000);

    timerRef.current = timerId;
    setIsCountingDown(true);
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
  //----------再開----------
  const restartTimer = () => {
    if (countdownMode === MODES.INACTIVE) return;

    //時間は初期化しない（ストップした時点から計測を再開するため）

    const timerId = setInterval(() => {
      setRemainingTimeMs((prev) => prev - 1000);
      countdownMode === MODES.WORK ? setWorkTimeElapsedMs((prev) => prev + 1000) : setRestTimeElapsedMs((prev) => prev + 1000);
    }, 1000);

    timerRef.current = timerId;
    setIsCountingDown(true);
  }

  //カウントダウン終了時の処理
  useEffect(() => {
    //残り時間が0の時だけ、処理を行う
    if (remainingTimeMs !== 0) return;

    //稼働中のタイマーを停止する
    clearInterval(timerRef.current);

    // 次のカウントダウンモードを設定
    changeMode();

    // 作業、または休憩の終了に応じてチャイムを鳴らす
    const soundToPlay = countdownMode === MODES.WORK ? sound.finishWork : sound.finishRest;
    soundToPlay.play();

  },[remainingTimeMs]);

  //1分ごとにAPIに経過時間を送信し、経過時間の状態をリセット
  useEffect(()=>{
    if (remainingTimeMs % (60 * 1000) === 0){
      saveTimerRecord(workTimeElapsedMs, restTimeElapsedMs);
      setWorkTimeElapsedMs(0);
      setRestTimeElapsedMs(0);
    };
  },[remainingTimeMs])

  useEffect(()=>{
    startTimer();
  },[countdownMode]);

  return (
    <div className="Countdown">
      <p>{ formattedMins } : { formattedSecs  }</p>
      <p>
        {countdownMode === MODES.WORK
          ? "作業中"
          : countdownMode === MODES.REST
          ? "休憩中"
          : null}
      </p>

      {/* countdownModeがinactiveであれば、changeModeを実行し、startTimer関数を発火させる。
          workまたはrestであればすでにスタート済みなので、restart関数を発火させる（ただし、isCountingDownがtrueの時は非表示にする） */}
      {
        countdownMode === MODES.INACTIVE ? (
          <button onClick={changeMode}>
            スタート
          </button>
        ) : (
          <button onClick={restartTimer} hidden={ isCountingDown }>
            リスタート
          </button>
        )
      }
      <button onClick={stopTimer}>ストップ</button>
      <button onClick={resetTimer}>リセット</button>
    </div>
  );
};

export default Countdown;