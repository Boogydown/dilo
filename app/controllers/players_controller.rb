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
	#require 'json'
	
  # PUT /players/1
  # PUT /players/1.xml
  def update
    @player = Player.find(params[:id])
    json = ActiveSupport::JSON.decode(request.raw_post)
	time_taken = json["time"]

	if(time_taken > 0)
		response = Response.new
		response.game_question_id = json["currentGameQuestion"]
		response.response_index = json["newResponse"]
		response.content = json["responseContent"]
		@player.responses <<  response
		@player.save
	end

    session = Session.find( json["sessionId"], :include=>[:game])
	message = nil
	 
	
	if(time_taken > 0)
	
		game = Game.find(session.game.id, :include=>[:game_questions])
		game_question = GameQuestion.find(json["currentGameQuestion"], :include=>[:multiple_choices])
		

		if(session.current_question == json["current_question"] )
			if(option_is_correct(game_question.multiple_choices, response.response_index))
				session.current_question = session.current_question + 1
				#session.state = "won"
				game_question.winner = @player.id
				game_question.winner_score = time_taken
				@player.score = @player.score + time_taken
				message = 'won'
				#response.content = game_question.ganswer
				game_question.save
				@player.save
      else#busted game, both players guessed wrong
        if(player_responded_incorrectly(session.players[0].responses, game_question) && player_responded_incorrectly(session.players[1].responses, game_question))
					session.current_question = session.current_question + 1
					message = 'bust'
		# else, the won message would've had to be sent first
        end
      end
		end

  else
      if(session.current_question == json["current_question"] )
        session.current_question = session.current_question + 1
        message = 'timedOut'
      end

  end
	    
	session.message = message
    session.save

	Pusher.app_id = '9510'
	Pusher.key = 'adfabbe2548895aaece0'
	Pusher.secret = '7d5f57f7b3b6c39317fb'
	channel_to_use = "player-channel" + session.id.to_s
	unencoded = session.as_api_response(:in_progress_session)
	
	#logger.debug "unencoded: #{unencoded}"
	
	
	#if(RAILS_ENV == 'Production')
	#	unencoded = JSON.parse(jsonEncoded)
	#else
	#unencoded = ActiveSupport::JSON.decode(jsonEncoded)
	
	Pusher[channel_to_use].trigger('session-updated', unencoded ) 
	
	
	
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
  
  
  def player_responded_incorrectly(responses, game_question)
  	return_val = false
    responses.each_with_index do |response, index|
      if(response.game_question_id == game_question.id)
          if(response.content != game_question.ganswer)
            return_val = true
          end
      end
    end
  	return_val
  
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
