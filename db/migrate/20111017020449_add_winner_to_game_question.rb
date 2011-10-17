class AddWinnerToGameQuestion < ActiveRecord::Migration
  def self.up
    add_column :game_questions, :winner, :integer
  end

  def self.down
    remove_column :game_questions, :winner
  end
end
