class Session < ActiveRecord::Base
  has_many :player_sessions
  has_many :players, :through => :player_sessions
  has_one :game

  def as_json(options={})
    super( :include =>[:players, :game], :except=>[:name, :created_at,:updated_at])
  end

end
