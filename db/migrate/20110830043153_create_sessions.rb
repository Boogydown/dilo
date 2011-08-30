class CreateSessions < ActiveRecord::Migration
  def self.up
    create_table :sessions do |t|
      t.string :state
      t.integer :current_question
      t.string :final_response

      t.timestamps
    end
  end

  def self.down
    drop_table :sessions
  end
end
