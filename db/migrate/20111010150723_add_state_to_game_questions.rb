class AddStateToGameQuestions < ActiveRecord::Migration
  def self.up
    add_column :game_questions, :state, :string
  end

  def self.down
    remove_column :game_questions, :state
  end
end
