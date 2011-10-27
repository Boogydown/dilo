class AddPromptUrlToQuestion < ActiveRecord::Migration
  def self.up
  	add_column :questions, :prompt_image, :string
  end

  def self.down
  	remove_column :questions, :prompt_image
  end
end
