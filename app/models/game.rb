class Game < ActiveRecord::Base
  #has_many :game_questions
  #has_many :questions, :through => :game_questions
  has_and_belongs_to_many :questions, :autosave => true

  has_many :sessions
  #accepts_nested_attributes_for :game_questions, :questions

  #def after_initialize
  #  Bar.all.each do |bar|
  #  wtfs << Wtf.new(:bar => bar, :data_i_need_to_set => 10)  # Rails should auto-assign :foo => self
  #  bars << bar
  #end


  def as_json(options={})
    super( :include =>[:questions])
  end

  def as_xml(options={})
     super( :include =>[:questions])
   end



end