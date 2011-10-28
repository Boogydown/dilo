class Question < ActiveRecord::Base
  has_many :game_questions
  has_many :games, :through => :game_questions
  #has_and_belongs_to_many :games
  has_many :responses
  belongs_to :questionset 
	
  attr_accessor  :choices

  def self.random
    #self.find(:first, :offset => rand(self.all.size-1))
	self.find(:first, :offset => rand(15))
	
	#self.find(:first, :offset => 501 + rand(20))
	#self.find(:first, :offset => rand(self.all.size-1), :conditions => ["questionset_id=?",  1])
	#self.find(:first, :offset => rand(10), :conditions => ["questionset_id=?",  1])
	#self.all(:conditions => ["questionset_id == ?", 1])
	
	
  end

  acts_as_api

  api_accessible :questions_and_choices do |t|
    t.add :prompt
    t.add :answer
	t.add :prompt_image
    t.add :id

  end

  api_accessible :complete_session do |t|
    t.add :prompt


	t.add :id

  end

end
