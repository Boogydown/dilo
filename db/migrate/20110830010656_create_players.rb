class CreatePlayers < ActiveRecord::Migration
  def self.up
    create_table :players do |t|
      t.string :name
      t.string :level
      t.string :ranking
      t.references :sessions
      t.timestamps
    end
  end

  def self.down
    drop_table :players
  end
end
