$(document).ready(function() {
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
});