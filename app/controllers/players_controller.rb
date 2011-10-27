class PlayersController < ApplicationController
  # GET /players
  # GET /players.xml
  def index
    @players = Player.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @players }
      format.json { render :json => @players }
    end
  end

  # GET /players/1
  # GET /players/1.xml
  def show
    @player = Player.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @player }
      format.json { render :json => @player }
    end
  end

  # GET /players/new
  # GET /players/new.xml
  def new
    @player = Player.new
    session[:current_user_id] = @player.id

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @player }
      format.json { render :json => @player }
    end
  end

  # GET /players/1/edit
  def edit
    @player = Player.find(params[:id])
  end

  # POST /players
  # POST /players.xml
  def create

    playerJson = ActiveSupport::JSON.decode(request.raw_post)
    logger.debug request.raw_post
    logger.debug playerJson
    logger.debug "player = " + playerJson['name']
    logger.debug "player = " + playerJson['name']

    #we must be handling json
    if(!playerJson.blank?)
      @player = Player.new
      @player.name = playerJson['name']
    else#handle html page
      @player = Player.new(params[:player])
    end

    respond_to do |format|
      if @player.save
        session[:current_user_id] = @player.id
        format.html { render :action => "show" }
        format.xml  { render :xml => @player, :status => :created, :location => @player }
        format.json  { render :json => @player, :status => :created, :location => @player }

      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @player.errors, :status => :unprocessable_entity }
        format.json  { render :json => @player.errors, :status => :unprocessable_entity }

      end
    end
  end

  def get_index_of_game_question(game_questions, id)
      game_question_index = 0
      game_questions.each_with_index do |gameQuestion, index|
        if(gameQuestion.id = id)
             game_question_index = index
        end
      end
      game_question_index
  end

	
	require 'pusher'
	
  # PUT /players/1
  # PUT /players/1.xml
  def update
    @player = Player.find(params[:id])
    json = ActiveSupport::JSON.decode(request.raw_post)

    session = Session.find( json["sessionId"], :include=>[:game])
    game = Game.find(session.game.id, :include=>[:game_questions])
    game_question = GameQuestion.find(json["currentGameQuestion"], :include=>[:multiple_choices])
	
    response = Response.new
    response.game_question = game_question
    response.response_index = json["newResponse"]

    if(session.current_question == json["current_question"] )
    	if(option_is_correct(game_question.multiple_choices, response.response_index))
			session.current_question = session.current_question + 1
			session.state = "won"
			game_question.winner = @player.id
			game_question.winner_score = json["time"]
			@player.score = @player.score + json["time"]
		#else
	  	#	session.state = "incorrect"
		end
    end

    game_question.save
    session.save

    @player.responses <<  response

	Pusher.app_id = '9510'
	Pusher.key = 'adfabbe2548895aaece0'
	Pusher.secret = '7d5f57f7b3b6c39317fb'

	#Pusher['player-channel'].trigger('response-created',  {:some => 'data'})
	#Pusher['player-channel'].trigger('session-updated', session.attributes) 
	Pusher['player-channel'].trigger('session-updated', ActiveSupport::JSON.decode( render_for_api :in_progress_session, :json => session, :root => :session )) 
	
	
	
    respond_to do |format|
      if @player.save
        format.html { redirect_to(@player, :notice => 'Player was successfully updated.') }
        format.xml  { head :ok }
        format.json  { head :ok }


      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @player.errors, :status => :unprocessable_entity }
        format.json  { render :xml => @player.errors, :status => :unprocessable_entity }

      end
    end
  end
  def option_is_correct(multiple_choices, choice_index)

      return_val = false
      multiple_choices.each_with_index do |choice, index|
          if(choice.correct && index == choice_index)
            return_val = true
          end
      end
      return_val

  end


  # DELETE /players/1
  # DELETE /players/1.xml
  def destroy
    @player = Player.find(params[:id])
    @player.destroy

    respond_to do |format|
      format.html { redirect_to(players_url) }
      format.xml  { head :ok }
      format.json  { head :ok }

    end
  end
end
