import client from "./apiClient";
import Cookies from "js-cookie";

interface Headers {
  "access-token": string | undefined;
  client: string | undefined;
  uid: string | undefined;
}

const saveTimerRecord = async (workTimeElapsedMs: number, restTimeElapsedMs: number): Promise<boolean | void> => {
  const params = {
    workTimeElapsedMs,
    restTimeElapsedMs,
  };

  const headers: Headers = {
    "access-token": Cookies.get("_access_token"),
    client: Cookies.get("_client"),
    uid: Cookies.get("_uid"),
  };

  try {
    const res = await client.post(
      "v1/timer_records",
      params,
      { headers }
    );
    if (res.status === 200) {
      return true;
    }
  } catch (e) {
    console.log(e);
  }
};

export default saveTimerRecord;