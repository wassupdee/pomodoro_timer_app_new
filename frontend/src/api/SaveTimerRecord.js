import client from "./apiClient";
import Cookies from "js-cookie";

const saveTimerRecord = async (workTimeElapsedMs, restTimeElapsedMs) => {
  const params = {
    workTimeElapsedMs,
    restTimeElapsedMs,
  };
  try {
    const res = await client.post(
      "v1/timer_records",
      params,
      {
        headers: {
          "access-token": Cookies.get("_access_token"),
          client: Cookies.get("_client"),
          uid: Cookies.get("_uid"),
        },
      }
    );
    if (res.status === 200) {
      return true;
    }
  } catch (e) {
    console.log(e);
  } finally {
  };
};

export default saveTimerRecord;