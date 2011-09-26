class Game < ActiveRecord::Base
  has_many :game_questions
  has_many :questions, :through => :game_questions
  #has_and_belongs_to_many :questions, :autosave => true

  belongs_to :session
  #accepts_nested_attributes_for :game_questions, :questions

  def as_json(options={})
    super( :include =>[:questions, :game_questions], :except=>[:name, :created_at,:updated_at])
  end


end