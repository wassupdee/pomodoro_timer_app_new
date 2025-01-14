import client from "../api/apiClient";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const TimerRecordsList = () => {

  const [timerRecords, setTimerRecords] = useState(null);

  useEffect(() => {
    fetchTimerRecords()
  },[]);

  const fetchTimerRecords = async () => {
    if (
      !Cookies.get("_access_token") ||
      !Cookies.get("_client") ||
      !Cookies.get("_uid")
    )
      return;

    try {
      const res = await client.get("v1/timer_records", {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      });
      if (res.status === 200) {
        console.log(res?.data.data);
        setTimerRecords(res?.data.data)
      } else {
        console.log(res?.data.data);
        console.log("no current user");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const formatDateToJapanese = (dateString) => {
    // 文字列をDateオブジェクトに変換
    const date = new Date(dateString);
    const year = date.getFullYear();
    // 0から始まるので+1をする
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}年${month}月${day}日`; // フォーマットされた日付
  };

  return (
    <div>
      {timerRecords ? (
        <table>
          <thead>
            <tr>
              <th>日付</th>
              <th>作業時間（分）</th>
              <th>休憩時間（分）</th>
            </tr>
          </thead>
          <tbody>
            {timerRecords.map((timerRecord, index) => (
              <tr key={index}>
                <td>{formatDateToJapanese(timerRecord.recordedDate)}</td>
                <td>{Math.floor(timerRecord.workTimeElapsedMs / 1000 / 60)}分</td>
                <td>{Math.floor(timerRecord.restTimeElapsedMs / 1000 / 60)}分</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default TimerRecordsList;