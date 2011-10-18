class Player < ActiveRecord::Base
  belongs_to :session
  has_many :responses

  # create the has_many :through relationship
  has_many :game_questions, :through => :responses

  acts_as_api

  api_accessible :complete_session do |t|
    t.add :id
    t.add :responses
  end

  api_accessible :in_progress_session do |t|
    t.add :id
    t.add :responses
  end



end
