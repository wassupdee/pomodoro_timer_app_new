class RenameTimeColumnsInTimerRecords < ActiveRecord::Migration[7.1]
  def change
    rename_column :timer_records, :study_time_ms, :work_time_elapsed_ms
    rename_column :timer_records, :rest_time_ms, :rest_time_elapsed_ms
  end
end
