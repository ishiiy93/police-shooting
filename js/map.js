// Function to draw your map
var drawMap = function() {

  // Create map and set view
  var map = L.map('mapLocation').setView([39.50, -98.35], 4)

  // Create a tile layer variable using the appropriate url
  var layer = L.tileLayer('http://a.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXNoaWl5OTMiLCJhIjoiY2lmeWpkNWg3NTV2NXVobTJpNThpZjAyaiJ9.NegxXV4QvKTXUDCzUVhEvw');

  // Add the layer to your map
  layer.addTo(map);

  // Execute your function to get data
	getData(map);
}

// Function for getting data
var getData = function(map) {

  // Execute an AJAX request to get the data in data/response.js
	var data;
	$.ajax({
		url:'data/response.json',
    	success:function(dat) {
    		data = dat;
    		customBuild(data, map);
    	},
     	dataType:"json"
	})

  // When your request is successful, call your customBuild function

}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data, map) {
	// Be sure to add each layer to the map
	/*var unknown = new L.LayerGroup([]);
	var white = new L.LayerGroup([]);
	var africanAmer = new L.LayerGroup([]);
	var asian = new L.LayerGroup([]);
	var indianAlaska = new L.LayerGroup([]);
	var hawaiianIslander = new L.LayerGroup([]);*/

	var raceName = [];
	var raceLayer = [];
	var whiteMen = 0;
	var nonWhiteMen = 0;
	var whiteW = 0;
	var nonWhiteW = 0;

	for (var i=0; i< data.length; i++) {
		var currentCase = data[i];

		if (currentCase['Hit or Killed?'] == 'Killed') {
			var color = 'red';
		} else {
			var color = 'black';
		}
		var circle = new L.circleMarker([currentCase.lat, currentCase.lng], {color:color, radius:'5'});
		if (currentCase.Race == undefined) {
			currentCase.Race = 'Unknown';
		}
		var currentRace = currentCase.Race;

		if (currentCase['Victim\'s Gender'] == 'Male') {
			if (currentRace == 'White') {
				whiteMen++;
			} else {
				nonWhiteMen++;
			}
		} else {
			if (currentRace == 'White') {
				whiteW++;
			} else {
				nonWhiteW++;
			}
		}


		if (raceName.indexOf(currentRace) == -1) {
			raceName.push(currentRace);
			var newLayer = new L.LayerGroup([]);
			circle.bindPopup(currentCase.Summary);
			circle.addTo(newLayer);
			raceLayer.push(newLayer);
		} else {
			var num = raceName.indexOf(currentRace);
			var layerNow = raceLayer[num];
			circle.bindPopup(currentCase.Summary);
			circle.addTo(layerNow);
		}

	}

	for (i = 0; i < raceLayer.length; i++) {
		raceLayer[i].addTo(map);	
	}
	// Once layers are on the map, add a leaflet controller that shows/hides layers
	var layers = {
		"Unknown": raceLayer[0]
	};

	for (i = 1; i < raceLayer.length; i++) {
		layers[raceName[i]] = raceLayer[i]
	}

	L.control.layers(null,layers).addTo(map);

	$('#infoTable').ready(function() {

    var data = [["", "Men", "Women/Unspecified"],
                ["White", whiteMen, whiteW], 
                ["Non-White", nonWhiteMen, nonWhiteW]]
    var raceGenderTable = makeTable($('#infoTable'), data);
	});

	function makeTable(container, data) {
	    var table = $("<table/>").addClass('table');
	    $.each(data, function(rowIndex, r) {
	        var row = $("<tr/>");
	        $.each(r, function(colIndex, c) { 
	            row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
	        });
	        table.append(row);
	    });
	    return container.append(table);
	}

	$('#infoTable').append(table);
  
}


