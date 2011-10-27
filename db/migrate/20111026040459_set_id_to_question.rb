class SetIdToQuestion < ActiveRecord::Migration
   def self.up
	add_column :questions, :questionset_id, :integer, :default => 0
  end

  def self.down
	remove_column :questions, :questionset_id
  end
end
