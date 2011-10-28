class AddPromptAndAnswerToGameQuestions < ActiveRecord::Migration
  def self.up
    add_column :game_questions, :gprompt, :string
    add_column :game_questions, :ganswer, :string
  end

  def self.down
    remove_column :game_questions, :ganswer
    remove_column :game_questions, :gprompt
  end
end
