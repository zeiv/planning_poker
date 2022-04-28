class CreateParticipants < ActiveRecord::Migration[6.0]
  def change
    create_table :participants do |t|
      t.integer :team_id
      t.integer :user_id
      t.integer :status, default: 0
      t.string :vote

      t.timestamps
    end
  end
end
