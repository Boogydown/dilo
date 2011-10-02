/*
 * shared scripts
 */

jQuery.fn.timer = function(selector, exitFunction) {
    if(!$(this).children(selector + ":last-child").is(":visible")){
        $(this).children(selector + ":visible")
            .css("display", "none")
            .next(selector).css("display", "block");
    }
    else if(exitFunction) {
         exitFunction.apply();
    }
    else {
        $(this).children(selector + ":visible")
            .css("display", "none")
        .end().children(selector + ":first")
            .css("display", "block");
    }
};

/*
 * login scripts
 */


/*
 * waiting screen scripts
 */

$('#waiting').live('pagecreate', function(event){
	$("#vocab-study .word-prompt:first").css("display", "block");

    var goToCountdown = function() {
        location.href="#countdown";
    }

	window.setInterval(function() {
		$("#vocab-study").timer(".word-prompt", goToCountdown);
	}, 1300);
});

/*
 * countdown scripts
 */

$('#countdown').live('pagecreate', function(event){
	$("#downer h1:first").css("display", "block");

    var goToQuestion = function() {
       location.href='#question';
    }

	window.setInterval(function() {
		$("#downer").timer("h1", goToQuestion);
	}, 1300);
});

// question screen scripts
$('#question').live('pagecreate', function(event){
    $(".answerChoice").addClass("unguessed");

    $(".answerChoice").bind('click', function(event) {
         $(this).removeClass("unguessed");

        if($(this).attr("correct") == "true")
            $(this).addClass("correct-guess");
         else
            $(this).addClass("incorrect-guess");

         $(this).siblings(".answerChoice").removeClass("unguessed");
         $(this).siblings(".answerChoice").addClass("guessed");

         $(".answerChoice").unbind(event);
         clearInterval(scoreCountdown);
    });

    var scoreWidth = 100;
    var score = Number($('div#scorebar').text());
    var scoreIncrement = score * .05;
    var scoreCountdown = window.setInterval(function(){
         scoreWidth = scoreWidth - 5;
         score = score - (scoreIncrement);

         if(score <= 0)
            clearInterval(scoreCountdown);

         $('div#scorebar').css('width', scoreWidth + '%');
         $('div#scorebar').text(score);
    }, 1000);
});

// game over scripts