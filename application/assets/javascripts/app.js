
$(document).ready(function(){

  var score   = 0;
  var die    = [];

  var $score        = $('h1.score')
  var $currentDie   = $('.current-die');
  var $add          = $('.add a.button');
  var $dice         = $('.dice a.button');
  var $continue     = $('a.button.continue');
  var $decision     = $('span.decision');
  var $keep         = $('span.keep');

  var farkleAI  = new FarkleAI();
  var startEvent = Modernizr.touch ? 'mousedown' : 'click' 

  // When you add a dice
  $dice.on(startEvent, function(){
    if ( die.length < 6 ){
      var value = $(this).attr('data-value');
      die.push( value )
      $currentDie.text( die.join(',') + " - " + die.length + " total" ); 
    }
  });  

  // When you click continue
  $continue.on(startEvent, function(){

    var subObject = farkleAI.findMaxScore(die);
    score = score + subObject.score;
    $score.text(score);

    var shouldContinue = farkleAI.shouldContinue(score, subObject.die) ? "Yes" : "No";


    if ( subObject.score > 0 ){
      $decision.text( shouldContinue + ', and your current roll gives you ' + subObject.score + " points.");

      if (subObject.die.length > 0 && shouldContinue == "Yes"){
        $keep.text( " Roll the: " + subObject.die.join(', ') );
      }

    }
    else{
      $decision.text( "Du er så dum! Farkle!" );
      $keep.empty();
    }

    die = []
    $currentDie.text( '' );

  });  

});