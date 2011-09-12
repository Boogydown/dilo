class Game < ActiveRecord::Base
  has_many :questions, :through => :game_questions
  has_many :sessions
end