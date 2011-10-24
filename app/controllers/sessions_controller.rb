class SessionsController < ApplicationController
  # GET /sessions
  # GET /sessions.xml
  def index
    @sessions = Session.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @sessions }
      format.json { render :json => @sessions }
    end
  end

  # GET /sessions/1
  # GET /sessions/1.xml
  def show
    @session = Session.find(params[:id])

    if((@session.state == "won") && (@session.updated_at + 3 > Time.now))
      @session.state = "nextQuestion"
      @session.save
    end


    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @session }
      #format.json  { render :json => @session  }
      format.json { render_for_api :in_progress_session, :json => @session, :root => :session }
		
    end
  end

  # GET /sessions/new
  # GET /sessions/new.xml
  def new
    @session = Session.new
    @session.state = 'waiting'

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @session }
      format.json  { render :json => @session }
    end
  end

  # GET /sessions/1/edit
  def edit
    @session = Session.find(params[:id])
  end


  # @param questions [questions]
  def generate_choices(questions, gameQuestion, current)
    #choices = Hash.new
    selectable = []
    selectable = questions - [questions[current]]
    randomized = selectable.sample(3)
    multiple_choices = []

    #randomly select 3 distractors(incorrect choices)
    for i in 0..2
    option = MultipleChoice.new
    option.content = trim_to_comma(randomized[i].answer)
    multiple_choices << option
    #gameQuestion.multiple_choices << option
    end

    #add the correct choice
    option = MultipleChoice.new
    option.content = trim_to_comma(questions[current].answer)
    option.correct = true
    #gameQuestion.multiple_choices << option
    multiple_choices << option

    unsorted = multiple_choices.to_a.sort_by {rand}

    unsorted.all? do |choice|
        gameQuestion.multiple_choices << choice
    end
  end

  def trim_to_comma(answer)
    if(!answer.index(',').nil?)
      answer = answer[0, answer.index(',')]
    end
    answer
  end


  # POST /sessions
  # POST /sessions.xml
  def create

    #look for an existing session
    @session = Session.where(:state=>"waiting").order("created_at ASC").limit(1).first

    #can't find one? let's create one.
    if(@session.blank?)
      @session = Session.new
      @session.state = 'waiting'
    else
      @session.state = 'active'
      @session.game = Game.new
      @session.current_question = 0
      #questions = Question.find(:all, :order => "created_at ASC", :limit => 7 )
      questions = []

      for i in 0..3
        questions <<  Question.random
      end


      questions.all? do |question|
          @session.game.questions << question
      end

      @session.game.game_questions.each_with_index do |gameQuestion, index|
        generate_choices(questions, gameQuestion, index)
        #@session.game.questions[index].choices = distractors
        #gameQuestion.update_attributes(:distractors => ActiveSupport::JSON.encode(distractors))
      end


      logger.debug @session.game.id

    end


    logger.debug @session
    json = ActiveSupport::JSON.decode(request.raw_post)

    #handling json
    if(!json.blank?)
      player = Player.find(json['playerId'])
      #add this player to the session
      @session.players.push(player)
      logger.debug player
    end



    respond_to do |format|
      if @session.save
        format.html { redirect_to(@session, :notice => 'Session was successfully created.') }
        format.xml  { render :xml => @session, :status => :created, :location => @session }
        #format.json  { render :json => @session, :status => :created, :location => @session }
        format.json { render_for_api :complete_session, :json => @session, :root => :session }

      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @session.errors, :status => :unprocessable_entity }
        format.json  { render :json => @session.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /sessions/1
  # PUT /sessions/1.xml
  def update
    @session = Session.find(params[:id])


    json = ActiveSupport::JSON.decode(request.raw_post)
    logger.debug json

    #@session.pla

    #json = ActiveSupport::JSON.decode(request.raw_post)
    #@session.state = json['state']

    respond_to do |format|
      if @session.save
        format.html { redirect_to(@session, :notice => 'Session was successfully updated.') }
        format.xml  { head :ok }
        format.json  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @session.errors, :status => :unprocessable_entity }
        format.json  { render :json => @session.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /sessions/1
  # DELETE /sessions/1.xml
  def destroy
    @session = Session.find(params[:id])
    @session.destroy

    respond_to do |format|
      format.html { redirect_to(sessions_url) }
      format.xml  { head :ok }
      format.json  { head :ok }

    end
  end
end



class Array
  # If +number+ is greater than the size of the array, the method
  # will simply return the array itself sorted randomly
  def randomly_pick(number)
    sort_by{ rand }.slice(0...number)
  end
end