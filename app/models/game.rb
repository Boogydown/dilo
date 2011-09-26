class Game < ActiveRecord::Base
  has_many :game_questions
  has_many :questions, :through => :game_questions
  #has_and_belongs_to_many :questions, :autosave => true

  has_many :sessions
  #accepts_nested_attributes_for :game_questions, :questions

  def as_json(options={})
    super( :include =>[:questions, :game_questions])
  end

end