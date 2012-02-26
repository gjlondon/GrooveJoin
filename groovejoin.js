var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;

var last_api_key = "37951315425b12b7d0ce457b4d5c255c"
var last_endpoint = "http://ws.audioscrobbler.com/2.0/?api_key="+last_api_key+"&format=json&method="
var list_counter = 0;
var globalArtistList = [];
var globalSongList = [];
var globalURIBlock = [];
var lastSong = false;
var lastURI = false;
var playlistLoaded = false;
var gUser1;
var gUser2;

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

function getTopArtists1(user, next_user, passed_list ){
    var artist_params = "user.gettopartists&limit=300&page=1&user=" 
    var api_request = last_endpoint+artist_params+user
    
    var req = new XMLHttpRequest();
    var artist_rows = new Array();
    req.open("GET", api_request, true);

	req.onreadystatechange = function() {

		console.log(req.status);

   		if (req.readyState == 4) {
    		    if (req.status == 200) {
       			console.log("Search complete!");
       		//	console.log(req.responseText);
			var obj = JSON.parse(req.responseText);
			var list = obj.topartists.artist;
		//	console.log(list[1]);
			for (i = 0;i<list.length;i++){
			    var temp_list=new Array(list[i].name,list[i].mbid,list[i]["@attr"].rank);
			    artist_rows[i] = temp_list;
			    
		//	    console.log(artist_rows[i]);
			}

			var joint_list = getTopArtist2(next_user, artist_rows);
			       
			return joint_list;
			//console.log(list.topartists.artist);
     		    }
   		}
  	};

	req.send();
};

function getTopArtist2(user, passed_list ){
    var artist_params = "user.gettopartists&limit=300&page=1&user=" 
    var api_request = last_endpoint+artist_params+user
    
    var req = new XMLHttpRequest();
    var artist_rows = new Array();
    req.open("GET", api_request, true);

	req.onreadystatechange = function() {

		console.log(req.status);

   		if (req.readyState == 4) {
    		    if (req.status == 200) {
       			console.log("Search complete!");

			var obj = JSON.parse(req.responseText);
			var list = obj.topartists.artist;

			for (i = 0;i<list.length;i++){
			    var temp_list=new Array(list[i].name,list[i].mbid,list[i]["@attr"].rank);
			    artist_rows[i] = temp_list;
			    

			}
		
			var joint_list = getJoinedList(passed_list,artist_rows)
			   
			return joint_list;

     		    }
   		}
  	};

	req.send();
};

function getJoinedList(list1, list2){
    console.log("getting joined list");
    var artists1 = []
    var artists2 = []
    joint_list = []
    for (row in list1){

	for (altRow in list2){
	    if (list1[row][0]===list2[altRow][0]){
		var joint_rank = 1.0/list1[row][2]+1.0/list2[altRow][2];
		joint_list.push([joint_rank,list1[row][0]]);
	    }
	}
    }
    
    joint_list.sort(sortByRank);
    rankedArtists = []
    for (item in joint_list){
	rankedArtists.push(joint_list[item][1]);
    }
    
    globalArtistList = rankedArtists;
    getSongs();
return joint_list;
};

function buildPlaylist(user1,user2) {

    var user1 = document.getElementById('user_name').value;
    var user2 = document.getElementById('friend_name').value;
    gUser1 = user1;
    gUser2 = user2;

    var joint_list = getTopArtists1(user1,user2);


   
}
function sortByRank(a, b) {
    var x = a[0];
    var y = b[0];
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

function getSongs(){
    var artists = document.getElementById("playlist_space");
//    console.log(artists);
//    console.log(globalArtistList);
    var artLen = globalArtistList.length;
    console.log("There will be "+artLen+" artists.");
    for (i=0;i<globalArtistList.length;i++){
	if (i===(artLen-1)){
	    lastSong = true;
	    console.log("just set lastsong to true because the counter is at "+i);
	    }
	var song = getSong(globalArtistList[i]);

	}
    //console.log(globalSongList);
   
}
function getSong(artist){
    
    var params = "artist.gettoptracks&limit=5&page=1&artist=" 
    var api_request = last_endpoint+params+artist;
    
    var req = new XMLHttpRequest();
    var artist_rows = new Array();
    req.open("GET", api_request, true);

	req.onreadystatechange = function() {

	//	console.log(req.status);

   		if (req.readyState == 4) {
    		    if (req.status == 200) {
  //     			console.log("Search complete!");
			var obj = JSON.parse(req.responseText);
			var list = obj.toptracks.track;
//			console.log(list);
			for (i = 0;i<list.length;i++){
			    globalSongList.push([list[i].name,artist]);
			    
			    }
	//		var block = document.getElementById('song_space');
			shuffle(globalSongList);
	//		block.innerHTML = globalSongList;
			if (lastSong === true){
			    console.log("it's the last song"); 
			    getSpotifyURIs();
			    }

			    
	
			
		    }	
  		};
	}

	req.send();
};
//shuffles list in-place
function shuffle(list) {
  var i, j, t;
  for (i = 1; i < list.length; i++) {
    j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
    if (j != i) {
      t = list[i];                        // swap list[i] and list[j]
      list[i] = list[j];
      list[j] = t;
    }
  }
}
function getSpotifyURIs(){
     


    var songLen = globalSongList.length;
    console.log("there are "+songLen+" songs");

    for (item=0; item< globalSongList.length; item++){
	var artist = globalSongList[item][1]
//	console.log("artist: "+artist);
	var track = globalSongList[item][0]
//	console.log("track: "+track);
	var params = "track.getPlaylinks&artist[]="+encodeURI(artist)+"&track[]="+encodeURI(track)
	var api_request = last_endpoint+params;
	console.log(item+" is item");
	if (item===(songLen.length-1)){
	    lastURI=true;
	    }
	else{
	    lastURI=false;
	    }
	getSpotifyURI(api_request);
	
    }

    
}
function getSpotifyURI(api_request){

	var req = new XMLHttpRequest();
	req.open("GET", api_request, true);


	req.onreadystatechange = function() {

	//	console.log(req.status);

   		if (req.readyState == 4) {
    		    if (req.status == 200) {
       	//		console.log("Search complete!");
			var obj = JSON.parse(req.responseText);
			var list = obj.spotify;
	//		console.log(list);
			globalURIBlock.push(list.track.externalids.spotify);
			console.log("some stuff"+lastURI);
	//		if (lastURI===true){
			    
	//		    if(playlistLoaded===false){
				var block = document.getElementById('song_space');
				block.innerHTML = "<ul>"+globalSongList+"</ul>";
//	var block = get
				//	loadPlaylist();
	//			}
	//		}

		//	console.log(globalURIBlock);

			    
	
			
		    }	
  		};
	}
    

	req.send();
}

function loadPlaylist(){
    
    var now = new Date();
    playlistLoaded = true;
    var playlist = new models.Playlist("GrooveJoin " +gUser1+"/"+gUser2+" "+ now.toDateString() +" "+ now.toLocaleTimeString())//fromURI("spotify:user:rogueleaderr:playlist:2EZclFWU67yAInmXBKUJQB");
    var tracks = playlist.tracks;
    for (track in tracks){
	try{
	    playlist.clear();
	    }
	catch(e){
	    console.log(e);
	}
    }

 //   console.log("playlist name: "+playlist);
    for (item in globalURIBlock){
    
	try{
	    playlist.add(globalURIBlock[item]);
	    }
	catch(e){
	    console.log(e);
	};
    }
}


