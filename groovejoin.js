var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;



function init() {
    console.log("init()");
} 

function click_test() {
    alert("it clicks");
}
    
function test2(){
    alert("test");
}

function doSearch(){

    var search = new models.Search("Counting Crows");
    search.localResults = models.LOCALSEARCHRESULTS.APPEND;
    console.log(search);
}

function playTrack(){
    var t = models.Track.fromURI("spotify:track:3bcYb4HwWlytUFLny0e0Q1");
    player.play(t);
    console.log(t);
}

function updatePageWithTrackDetails() {
	
	var header = document.getElementById("playlist_space");

	// This will be null if nothing is playing.
	var playerTrackInfo = player.track;

	if (playerTrackInfo == null) {
		header.innerText = "Nothing playing!";
	} else {
		var track = playerTrackInfo.data;
		header.innerHTML = track.name + " on the album " + track.album.name + " by " + track.album.artist.name + ".";
	}
}

function searchLastFMForEvents(city) {

	var req = new XMLHttpRequest();
	req.open("GET", "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=" + city + "&api_key=YOUR_KEY_HERE", true);

	req.onreadystatechange = function() {

		console.log(req.status);

   		if (req.readyState == 4) {
    		if (req.status == 200) {
       			console.log("Search complete!");
       			console.log(req.responseText);
     		}
   		}
  	};

	req.send();
}
