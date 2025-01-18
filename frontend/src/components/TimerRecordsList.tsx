import client from "../api/apiClient";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { AxiosRequestConfig } from "axios";

const TimerRecordsList = () => {
  console.log("TimerRecordsListコンポーネントがレンダリングされました")

  interface TimerRecord {
    id: string;
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
    const year: number = Number(date.getFullYear().toString().slice(-2));
    // 0から始まるので+1をする
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    return `${year}年${month}月${day}日`; // フォーマットされた日付
  };

  return (
    <div>
      <h1 className="text-3xl text-center">計測記録</h1>
      {timerRecords ? (
        <div className="flex flex-col items-center mt-10">
          <table>
            <thead>
              <tr>
                <th className="border border-gray-900">日付</th>
                <th className="border border-gray-900">作業時間</th>
                <th className="border border-gray-900">休憩時間</th>
              </tr>
            </thead>
            <tbody>
              {timerRecords.map((timerRecord: TimerRecord) => (
                <tr key={timerRecord.id}>
                  <td className="border border-gray-900 text-center">
                    {formatDateToJapanese(timerRecord.recordedDate)}
                  </td>
                  <td className="border border-gray-900 text-center">
                      {`${Math.floor(Number(timerRecord.workTimeElapsedMs) / 1000 / 60)}分`}
                  </td>
                  <td className="border border-gray-900 text-center">
                    {`${Math.floor(Number(timerRecord.restTimeElapsedMs) / 1000 / 60)}分`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/" className="font-medium text-blue-600 dark:text-blue-500 underline space-x-4 text-lg text-center mt-10">
            ホーム
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TimerRecordsList;