class AddPlayerIdToResponses < ActiveRecord::Migration
  def self.up
    add_column :responses, :player_id, :integer
    add_column :responses, :game_question_id, :integer
  end

  def self.down
    remove_column :responses, :player_id
    remove_column :responses, :game_question_id
  end
end
