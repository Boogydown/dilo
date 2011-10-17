class Session < ActiveRecord::Base
  has_many :player_sessions
  has_many :players, :through => :player_sessions
  has_one :game

  def as_json(options={})
    super( :include =>[:players, :game], :except=>[:name, :created_at,:updated_at])
  end



  acts_as_api

  api_accessible :complete_session do |t|
    t.add :id
    t.add :state
    t.add :players
    t.add :game
    t.add :current_question
  end

  api_accessible :in_progress_session do |t|
      t.add :id
      t.add :state
      t.add :players
      t.add :game
      t.add :current_question
  end






end
