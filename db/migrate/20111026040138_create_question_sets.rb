class CreateQuestionSets < ActiveRecord::Migration
  def self.up
    create_table :question_sets do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end

  def self.down
    drop_table :question_sets
  end
end
