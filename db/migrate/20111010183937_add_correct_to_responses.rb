class AddCorrectToResponses < ActiveRecord::Migration
  def self.up
    add_column :multiple_choices, :correct, :boolean
  end

  def self.down
    remove_column :multiple_choices, :correct
  end
end
