class AddGameToSession < ActiveRecord::Migration
  def self.up
    add_column :sessions, :game_id, :integer
    add_column :sessions, :player_sessions_id, :integer
  end

  def self.down
    remove_column :sessions, :game_id
    remove_column :sessions, :player_sessions_id
  end
end
