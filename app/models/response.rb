class Response < ActiveRecord::Base
  belongs_to :player
  belongs_to :game_question

  acts_as_api

  api_accessible :complete_session do |t|
    t.add :player
    t.add :content
    end

  api_accessible :in_progress_session do |t|
    t.add :player
    t.add :content
    t.add :response_index

  end


end
