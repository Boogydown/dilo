class Question < ActiveRecord::Base
  has_many :game_questions
  has_many :games, :through => :game_questions
  #has_and_belongs_to_many :games
  has_many :responses
  attr_accessor  :choices

  def as_json(options={})
    super( :include =>[:choices])
  end


end
