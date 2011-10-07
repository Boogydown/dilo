class Question < ActiveRecord::Base
  has_many :game_questions
  has_many :games, :through => :game_questions
  #has_and_belongs_to_many :games
  has_many :responses
  def initialize
           @choices = Hash.new
  end

  attr_accessor  :choices

  #def as_json(options={})
  #  super( :include =>[:choices])
  #end
  #
  #QUESTION_JSON_OPTS = { :include => :prompt }
  #
  #def as_json(options={})
  #  super(QUESTION_JSON_OPTS)
  #end
  acts_as_api

  api_accessible :questions_and_choices do |t|
    t.add :prompt
  end



end
