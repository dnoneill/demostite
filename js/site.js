function articlerender(articleurl, item_id){
    marker = items[item_id];
    if (marker.length > 1 ) {
    var articleicon = ''
      for (i = 0; i < marker.length; i++) { 
      articleicon += "<img class='article-marker' src='" + marker[i].iconURL + "' onclick='mapClick(" + i +")'>";
      setMapView(marker[i]);
	   } 
    } else {
    var articleicon = "<img class='article-marker' src='" + marker[0].iconURL  + "' onclick='mapClick(0)'>";
    setMapView(marker[0]);
    }

  	$.get(articleurl, function(data){
    	var index = data.indexOf("</h1>");
      console.log(articleicon)
        data = data.slice(0, index) + articleicon + data.slice(index);
        $("#sidebar-content").html(data);
    });
   $( ".sidebar" ).scrollTop(0); //tell sidebar scroll to go to the top
}

// function pagerender(page_url){
// 	$.get(page_url, function(data){
// 		$("#sidebar-content").html(data);
// 	  });
// 	map.closePopup();
// 	$( ".sidebar" ).scrollTop(0); //tell sidebar scroll to go to the top
// }


function setMapView(marker){
	try { 
		markers.zoomToShowLayer(marker, function () {
      marker.openPopup();
		});
	} catch(err) {
    marker.openPopup();
	}
}

function mapClick(i){
  url = window.location.href;
  url = url.split("#");
  item_id = url[1];
  marker = items[item_id];
  setMapView(marker[i]);
};
var current_position, current_accuracy;

function onLocationFound(e) {
  // if position defined, then remove the existing position marker and accuracy circle from the map
  if (current_position) {
      map.removeLayer(current_position);
      map.removeLayer(current_accuracy);
  }

  var radius = e.accuracy / 2;

  current_position = L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters from this point").openPopup();

  current_accuracy = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}


function locate() {
  map.locate({setView: true, maxZoom: 16});
}

function new_map(site_grouping){
  markergrouping = localStorage['selectedtem'];
  if (markergrouping == undefined) {
  markergrouping = site_grouping;
  } 
  map.remove();

  $('#choose').val(markergrouping);
  map = L.map('map' , {scrollWheelZoom: false}).setView([0, 0], 1);
  items = makeMap(markergrouping, map);
}
