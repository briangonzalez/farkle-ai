
function FarkleAI(){

  this.findMaxScore = function(rawDice){
    rawDice = rawDice.sort().reverse();
    var values        = [0,0,0,0,0,0];

    _.each(rawDice, function(value, index){
      var idx = value - 1;
      values[idx] += 1;
    });

    var totalScore = 0;

    var subObject = this.findSubScore(values);
    var subScore  = subObject.score;
    values        = subObject.values;

    while( subScore > 0 ){
      totalScore  += subScore;
      subObject   = this.findSubScore(values);
      subScore    = subObject.score;
      values      = subObject.values;
    }

    var die        = [];
    _.each(values, function(value, index){
      if (value > 0){
        _.each( _.range(value), function(){
          die.push(index + 1)
        });
      }
    }) 

    return { score: totalScore, die: die  }; 
  }

  this.findSubScore = function(values){

    var subScore    = 0;
    var sValues     = _.clone(values).sort().reverse();

    if ( sValues[0] == 6 ){
      // 6 of any number -  3000
      subScore += 3000;
      values = [0,0,0,0,0,0];
    }
    else if ( sValues[0] == 3 && sValues[1] == 3 ){
      // two triplets - 2500
      subScore += 2500;
      values = [0,0,0,0,0,0];
    }
    else if ( sValues[0] == 5  ){
      // 5 of any number - 2000
      subScore += 2000;
      values[ values.indexOf(5) ] = 0;
    }
    else if ( values == [1,1,1,1,1,1] ){
      // straight - 1500
      subScore += 1500;
      values = [0,0,0,0,0,0];
    }
    else if ( sValues[0] == 4 && sValues[1] == 2 ){
      // 4 of a kind && two of a kind - 1500
      subScore += 1500;
      values = [0,0,0,0,0,0];
    }
    else if ( sValues[0] == 2 && sValues[1] == 2 && sValues[2] == 2  ){
      // 2 of a kind x 3 - 1500
      subScore += 1500;
      values = [0,0,0,0,0,0];
    }
    else if ( sValues[0] == 4 ){
      // 4 of a kind  -  1000
      subScore += 1000;
      values[ values.indexOf(4) ] = 0;
    }
    else if ( sValues[0] == 3 ){
      // 3 of kind of any - base * 100 || 300 if base == 1

      subScore += (values.indexOf(3) + 1) * 100;
      if( values.indexOf(3) == 0 ) // fix for the 300 point bug
        subScore += 200;

      values[ values.indexOf(3) ] = 0;
    }
    else if ( values[0] > 0 || values[4] > 0 ){
      // 1's or 5's
      subScore += (values[0] * 100) + (values[4] * 50);
      values[0] = 0;
      values[4] = 0;
    }
    else{
      // no score, bitch.
    }

    // console.log('Subscore: ', subScore, ", Values: ", values)
    return { score: subScore, values: values }
  }

  this.shouldContinue = function(firstScore, remainingValues){

    var n = 5000.0;
    var eMargin = 10.0;

    var self = this;
    var nDices = remainingValues.length;
    var s = 0.0;
    var randomDiceValues = new Array(nDices);
    _.each( _.range(n), function() {
      
      _.each( _.range(nDices), function(value, index){
        randomDiceValues[index] = Math.floor(Math.random()*5) + 1;  
      })

        var tmp = self.findMaxScore(randomDiceValues);
        if(tmp.score > 1.0)
            s += tmp.score + firstScore;
    } )

    var avg = s / n;
    console.log("MC score is: ", avg);
    if( avg > (firstScore+eMargin) )
      return true;

    return false;
  }

}