import client from "../api/apiClient";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { AxiosRequestConfig } from "axios";

const TimerRecordsList = () => {

  interface TimerRecord {
    recordedDate: string;
    workTimeElapsedMs: string;
    restTimeElapsedMs: string;
  }


  const [timerRecords, setTimerRecords] = useState<TimerRecord[] | null>(null);

  useEffect(() => {
    fetchTimerRecords()
  },[]);

  const fetchTimerRecords = async (): Promise<void> => {

    const config: AxiosRequestConfig = {
      headers: {
        "access-token": Cookies.get("_access_token") || "",
        client: Cookies.get("_client") || "",
        uid: Cookies.get("_uid") || "",
      }
    };

    try {
      const res = await client.get(
        "v1/timer_records",
        config,
      );
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

  const formatDateToJapanese = (dateString: string): string => {
    // 文字列をDateオブジェクトに変換
    const date: Date = new Date(dateString);
    const year: number = date.getFullYear();
    // 0から始まるので+1をする
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    return `${year}年${month}月${day}日`; // フォーマットされた日付
  };

  return (
    <div>
      {timerRecords ? (
        <>
          <table>
            <thead>
              <tr>
                <th>日付</th>
                <th>作業時間（分）</th>
                <th>休憩時間（分）</th>
              </tr>
            </thead>
            <tbody>
              {timerRecords.map((timerRecord: TimerRecord, index: number) => (
                <tr key={index}>
                  <td>{formatDateToJapanese(timerRecord.recordedDate)}</td>
                  <td>{Math.floor(Number(timerRecord.workTimeElapsedMs) / 1000 / 60)}分</td>
                  <td>{Math.floor(Number(timerRecord.restTimeElapsedMs) / 1000 / 60)}分</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/">ホーム</Link>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default TimerRecordsList;