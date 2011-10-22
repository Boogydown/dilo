class AddScoreToPlayer < ActiveRecord::Migration
  def self.up
    add_column :players, :score, :integer, :default => 0
    add_column :game_questions, :winner_score, :integer, :default => 0

  end

  def self.down
    remove_column :players, :score
    remove_column :game_questions, :winner_score
  end
end
