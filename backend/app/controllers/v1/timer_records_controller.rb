class V1::TimerRecordsController < ApplicationController
  before_action :authenticate_v1_user!
  before_action :find_today_timer_record, only: [:create_or_update]

  def index
    timer_records = current_v1_user.timer_records
    render json: { user: current_v1_user, data: timer_records }
  end

  def create_or_update
    # 日付が一致するレコードがあれば更新する。なければ、新しくレコードをつくる
    if @today_timer_record
      if @today_timer_record.update(merged_time_elapsed_ms(@today_timer_record))
        render json: { message: '計測時間レコードが更新されました', data: @today_timer_record }
      else
        render json: { message: '計測時間レコードの更新に失敗しました', errors: @today_timer_record.errors.full_messages }
      end
    else
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

  def merged_time_elapsed_ms(timer_record)
    {
      work_time_elapsed_ms: timer_record.work_time_elapsed_ms.to_i + timer_record_params[:work_time_elapsed_ms].to_i,
      rest_time_elapsed_ms: timer_record.rest_time_elapsed_ms.to_i + timer_record_params[:rest_time_elapsed_ms].to_i
    }
  end

  def find_today_timer_record
    @today_timer_record = current_v1_user.timer_records.find_by(recorded_date: Time.zone.today)
  end
end
