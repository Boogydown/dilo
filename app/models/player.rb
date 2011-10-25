class Player < ActiveRecord::Base
  belongs_to :session
  has_many :responses

  # create the has_many :through relationship
  has_many :game_questions, :through => :responses

  acts_as_api

  api_accessible :complete_session do |t|
    t.add :id
    t.add :name
    t.add :responses
  end

  api_accessible :in_progress_session do |t|
	t.add :name  #we need the name every time for the player who created session: they didn't have their paired partner, yet
	t.add :id
    t.add :responses
    t.add :score
  end



end
