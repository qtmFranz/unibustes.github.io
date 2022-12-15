const mnzParties = {
  //"Greens": [23, 52.5, 9.7],
  //"Kiwi": [52, 43, 50],
  //"Liberals": [58.6, 52.1, 32.8],
  //"Labour": [25, 60, 41],
  //"Front": [45, 4, 75],
};


$(function () {
  $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
})

function calculate(section) {
  var score = 0;
  $("#" + section + " select").each(function (index) {

    var sign = Math.pow(-1, index % 2);
    score += parseFloat($(this).val()) * sign;
  });
  return score;
}

$("#results-button").click(function () {
  $("#questions").hide();
  $("#results").show();
  
  const xn = 10;
  const yn = 10;
  //const zn = 15;
  
  var xScore = (xn * 17.533 + calculate("economics")) / (xn * 17.533 * 2) * 100;
  var yScore = (yn * 17.533 + calculate("state")) / (2 *  yn * 17.533) * 100;
  //var zScore = (zn * 17.533 + calculate("civil")) / (2 * zn * 17.533) * 100;
  
  $("#userPin").css("left", "" + xScore + "%");
  $("#userPin").css("top", "" + yScore + "%");
  //$("#userBar").css("top", "" + zScore  + "%");

  $("#xScore").text(Math.round(xScore));
  $("#yScore").text(100 - Math.round(yScore));
  //$("#zScore").text(100 - Math.round(zScore));
  
  var closestParties = closestParty(xScore, yScore, zScore, []);
  $("#align").text(closestParties[0] + ", then " + closestParties[1] + ", then " + closestParties[2]);
});

function closestParty(xScore, yScore, zScore, excludes) {
  var smallestParty = "";
  var smallestPartyDistance = 1000;
  var closestParties = excludes;
  
  for (var party in mnzParties) {
    if (closestParties.indexOf(party) > -1) {
      continue;
    }
    var scores = mnzParties[party];
    var d = Math.sqrt(Math.abs(Math.pow(xScore - scores[0], 2) + Math.pow(yScore - scores[1], 2) + Math.pow(zScore - scores[2], 2)));
    
    if (d < smallestPartyDistance) {
      smallestPartyDistance = d;
      smallestParty = party;
    }
  }
  
  closestParties.push(smallestParty);
  if (closestParties.length >= 3) {
    return closestParties;
  } else {
    return closestParty(xScore, yScore, zScore, closestParties);
  }
}


for (var party in mnzParties) {
  var scores = mnzParties[party];
  var pin = $("<div/>")
  .addClass("partyPin pin")
  .css("left", "" + scores[0] + "%")
  .css("top", "" + scores[1] + "%");
  
  var i = $("<i/>")
  .addClass("material-icons")
  .attr("data-toggle", "tooltip")
  .attr("title", party)
  .text("fiber_manual_record");
  
  pin.append(i);
  $("#axes").append(pin);
  
  var scalePin = $("<div/>")
  .addClass("partyBar bar")
  .css("top", "" + scores[2] + "%")
  .attr("data-toggle", "tooltip")
  .attr("title", party);
  $("#scale > div").append(scalePin);
  
}