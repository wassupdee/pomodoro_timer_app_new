class CreateTimerRecords < ActiveRecord::Migration[7.1]
  def change
    create_table :timer_records do |t|
      t.integer :study_time_ms
      t.integer :rest_time_ms
      t.date :recorded_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
