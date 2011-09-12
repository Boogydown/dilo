class CreateOptions < ActiveRecord::Migration
  def self.up
    create_table :options do |t|
      t.text :content
      t.boolean :correct
      t.integer :order
      t.references :question
      t.timestamps
    end
  end

  def self.down
    drop_table :options
  end
end
