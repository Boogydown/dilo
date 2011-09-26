class AddSessionIdToGames < ActiveRecord::Migration
  def self.up
    add_column :games, :session_id, :integer
  end

  def self.down
    remove_column :games, :session_id
  end
end
