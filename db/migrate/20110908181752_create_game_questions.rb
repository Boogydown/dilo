class CreateGameQuestions < ActiveRecord::Migration
  def self.up
    create_table :game_questions do |t|
      t.references :game
      t.references :question
      t.integer :order
      t.timestamps
    end
  end

  def self.down
    drop_table :game_questions
  end
end
