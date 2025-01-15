import { useState, useEffect, useRef } from 'react';
import saveTimerRecord from '../api/SaveTimerRecord';

const Countdown = () => {
  //----------時間----------
  //作業時間25分、休憩時間5分とする
  const workTime: number = 10 * 1000;
  const restTime: number = 6 * 1000;

  //残り時間を保持する変数
  const [remainingTimeMs, setRemainingTimeMs] = useState<number>(workTime);
  const remainingTimeMins: number = Math.floor(remainingTimeMs / 1000 / 60);
  const remainingTimeSecs: number = Math.floor(remainingTimeMs / 1000 % 60);

  //経過時間を保持する変数
  const [workTimeElapsedMs, setWorkTimeElapsedMs] = useState<number>(0);
  const [restTimeElapsedMs, setRestTimeElapsedMs] = useState<number>(0);

  //経過時間をリセットする
  const resetTimeElapsedMs = (): void => {
    setWorkTimeElapsedMs(0);
    setRestTimeElapsedMs(0);
  };

  //----------計測モード----------
  const MODES = {
    INACTIVE: "inactive",
    WORK: "work",
    REST: "rest",
  } as const;

  type Mode = typeof MODES[keyof typeof MODES];

  const [countdownMode, setCountdownMode] = useState<Mode>(MODES.INACTIVE);

  //カウントダウン実行中のフラグ(ボタンの出し分けに使用)
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);

  const changeMode = ():void => {
    setCountdownMode(countdownMode === MODES.WORK ? MODES.REST : MODES.WORK)
  };


  //----------タイマー動作を支える機能関連----------
  //カウントダウンタイマーのIDを保持する
  const timerRef = useRef<number | null>(null);

  //カウントダウン終了時のチャイム
  interface Sounds {
    finishWork: HTMLAudioElement;
    finishRest: HTMLAudioElement;
  }

  const sounds: Sounds = {
    finishWork: new Audio("/finishWorkWhistle.wav"),
    finishRest: new Audio("/finishRestChime.wav")
  };


  //----------タイマー機能----------
  //----------開始----------
  const startTimer = (): void => {
    if (countdownMode === MODES.INACTIVE) return;

    //時間を初期化設定する
    setRemainingTimeMs(countdownMode === MODES.WORK ? workTime : restTime)

    const timerId: number = window.setInterval((): void => {
      setRemainingTimeMs((prev) => prev - 1000);
      countdownMode === MODES.WORK ? setWorkTimeElapsedMs((prev) => prev + 1000) : setRestTimeElapsedMs((prev) => prev + 1000);
    }, 1000);

    timerRef.current = timerId;
    setIsCountingDown(true);
  };

  //countdownModeが変更されたら、タイマーを開始する
  useEffect(()=>{
    startTimer();
  },[countdownMode]);

  //----------再開----------
  const restartTimer = (): void => {
    if (countdownMode === MODES.INACTIVE) return;

    //時間は初期化しない（ストップした時点から計測を再開するため）

    const timerId: number = window.setInterval((): void => {
      setRemainingTimeMs((prev) => prev - 1000);
      countdownMode === MODES.WORK ? setWorkTimeElapsedMs((prev) => prev + 1000) : setRestTimeElapsedMs((prev) => prev + 1000);
    }, 1000);

    timerRef.current = timerId;
    setIsCountingDown(true);
  }

  //----------停止----------
  const stopTimer = (): void => {
    clearInterval(timerRef.current);
    setIsCountingDown(false);

    saveTimerRecord(workTimeElapsedMs, restTimeElapsedMs);
    resetTimeElapsedMs();
  };

  //----------リセット----------
  const resetTimer = (): void => {
    clearInterval(timerRef.current)
    setRemainingTimeMs(workTime);
    setIsCountingDown(false);
    setCountdownMode(MODES.INACTIVE);

    saveTimerRecord(workTimeElapsedMs, restTimeElapsedMs);
    resetTimeElapsedMs();
  };

  //----------カウントダウン終了時の処理----------
  useEffect(() => {
    //残り時間が0の時だけ、処理を行う
    if (remainingTimeMs !== 0) return;

    //稼働中のタイマーを停止する
    clearInterval(timerRef.current);

    // 次のカウントダウンモードを設定
    changeMode();

    // 作業、または休憩の終了に応じてチャイムを鳴らす
    const soundToPlay: HTMLAudioElement = countdownMode === MODES.WORK ? sounds.finishWork : sounds.finishRest;
    soundToPlay.play();

  },[remainingTimeMs]);


  //----------APIに経過時間を送信する----------
  useEffect(()=>{
    if (remainingTimeMs % (60 * 1000) === 0){
      saveTimerRecord(workTimeElapsedMs, restTimeElapsedMs);
      resetTimeElapsedMs();
    };
  },[remainingTimeMs])


  //----------表示関連----------
  //２桁で時間表示する
  const formattedMins: string | number = remainingTimeMins < 10 ? "0" + remainingTimeMins : remainingTimeMins;
  const formattedSecs: string | number = remainingTimeSecs < 10 ? "0" + remainingTimeSecs : remainingTimeSecs;

  return (
    <div className="Countdown">
      <p>{ formattedMins } : { formattedSecs }</p>
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