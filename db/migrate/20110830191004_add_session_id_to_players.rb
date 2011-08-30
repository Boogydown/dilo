class AddSessionIdToPlayers < ActiveRecord::Migration
  def self.up
    add_column :players, :session_id, :integer
  end

  def self.down
    remove_column :players, :session_id
  end
end
