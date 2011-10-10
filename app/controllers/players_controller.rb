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

  # PUT /players/1
  # PUT /players/1.xml
  def update
    @player = Player.find(params[:id])
    json = ActiveSupport::JSON.decode(request.raw_post)

    session = Session.find( json["sessionId"])
    #game_question = session.game.game_questions.find(json["currentGameQuestion"])
    #@player =session.players.find(params[:id])

    game_question = GameQuestion.find(json["currentGameQuestion"])
    #response = Response.where("player_id = ? AND game_question_id=?", @player.id, game_question.id).limit(1).first



    response = Response.new
    response.game_question = game_question
    response.response_index = json["newResponse"]
    if(option_is_correct(session.game.game_questions[session.current_question].multiple_choices, response.response_index))
      game_question.state = "complete"
      game_question.save
      session.current_question = session.current_question + 1
      session.save
    end
    @player.responses <<  response


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
