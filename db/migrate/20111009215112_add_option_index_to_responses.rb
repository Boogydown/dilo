class AddOptionIndexToResponses < ActiveRecord::Migration
  def self.up
    add_column :responses, :response_index, :integer
  end

  def self.down
    remove_column :responses, :response_index
  end
end
