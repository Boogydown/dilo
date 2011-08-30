class CreatePlayerSessionTableJoin < ActiveRecord::Migration
  def self.up
    create_table 'players_sessions', :id => false do |t|
      t.references :player
      t.references :session
    end
  end

  def self.down
    drop_table 'players_sessions'
  end
end
