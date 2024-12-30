import { useState } from 'react';

const Countdown = () => {

  //作業時間（25分）からカウントダウンを始める
  const [remainingTimeMs, setRemainingTimeMs] = useState(25 * 60 * 1000);

  return (
    <p></p>
  );
};

export default Countdown;