class V1::TimerRecordsController < ApplicationController
  before_action :authenticate_v1_user!

  def create_or_update
    # 今日の日付を取得
    today = Time.zone.today

    today_timer_record = current_v1_user.timer_records.find_by(recorded_date: today)

    if today_timer_record
      # 日付が一致するレコードがあれば更新する
      if today_timer_record.update(timer_record_params)
        render json: { message: '計測時間レコードが更新されました', data: today_timer_record }
      else
        render json: { message: '計測時間レコードの更新に失敗しました', errors: today_timer_record.errors.full_messages }
      end
    else
      # 日付が一致するレコードがなければ新しくつくる
      new_timer_record = current_v1_user.timer_records.new(timer_record_params.merge(recorded_date: today))
      if new_timer_record.save
        render json: { message: '新しい計測時間レコードが保存されました' }
      else
        render json: { message: '新しい計測時間レコードの保存に失敗しました', errors: new_timer_record.errors.full_messages }
      end
    end
  end

  private

  def timer_record_params
    params.permit(:work_time_elapsed_ms, :rest_time_elapsed_ms)
  end
end
