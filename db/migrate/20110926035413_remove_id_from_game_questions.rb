class RemoveIdFromGameQuestions < ActiveRecord::Migration
  def self.up
    drop_table :game_questions
    create_table :games_questions, :id => false do |t|
      t.references :game
      t.references :question
      end
  end

  def self.down
    drop_table :games_questions
    create_table :game_questions do |t|
      t.references :game
      t.references :question
      t.integer :order
      t.timestamps
      end
  end
end
