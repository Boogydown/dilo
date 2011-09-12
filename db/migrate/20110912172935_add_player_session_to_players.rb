class AddPlayerSessionToPlayers < ActiveRecord::Migration
  def self.up
    remove_column :players, :session_id
    add_column :players, :player_session_id, :integer
  end

  def self.down
    remove_column :players, :player_session_id
    add_column :players, :session_id, :integer
  end
end
