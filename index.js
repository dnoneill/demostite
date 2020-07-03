const mapview = Vue.component('mapview', {
  template: `
  <div>
  <div class="sidebar">
      <div id="sidebar-content">
      <button v-on:click="locate()">Where Am I?</button>
      <header>
        <p class="post-header" v-if="sidebar.header">{{sidebar.header}}</p>
        <p class="post-header" v-else>{{siteTitle}}</p>
        <h1 class="title" v-if="sidebar.title">{{sidebar.title}}
          <a v-on:click="goToMarker(sidebar.marker)" class="legend" v-if="sidebar.marker" v-html="sidebar.marker.iconURL">
          </a>
        </h1>
        <p class="byline">
        <span v-if="sidebar.author">{{sidebar.author}}</span>
        <span v-if="sidebar.author && sidebar.date">, </span>
        <span v-if="sidebar.date">{{sidebar.author}}</span>
        </p>
      </header>
      <div v-html="sidebar.content"></div>
      </div>
  </div>
  <div id="map"></div>
  <div v-bind:class="menuType">
  <button v-bind:class="menuType" class="menu-button" v-on:click="menuShown = !menuShown;">
        <i v-if="!menuShown"class="fa fa-bars"></i>
        <i v-else class="fa fa-times close-btn"></i>
      </button>
    <div v-bind:class="menuType + '-content'" class="sub-menu" >
      
      <span v-if="menuShown">
      <a v-for="page in sitePages" v-on:click="updateHash(page)" class="menu-link">
        <span v-if="page.menutitle" v-html="page.menutitle"></span>
        <span v-else v-html="page.title"></span>
      </a>
      </span>
    </div>  
</div>
  <select id="choose" class="dropdown" v-model="markergrouping">
    <option value="grouped">Clustered</option>
    <option value="single">Not clustered</option>
  </select>

  </div>`,
  data: function() {
  	return {
      map: '',
      markergrouping: 'grouped',
      overLayers: [],
      markers: '',
      mapMarkers: [],
      layerControl: '',
      sidebar: '',
      sitePages: pages,
      menuType: menuType,
      menuShown: false,
      siteTitle: siteTitle,
      current: {'position': '', 'accuracy': ''}
  	}
  },
  props: {
    sitedata: Object
  },
  watch: {
    markergrouping: function() {
      this.addMarkers();
      
    },
    "$route.path": function(){
      this.buildPage();
    }
  },
  created() {    
  },
  mounted() {    
    var haveTitles = pages.filter(element => element['order'])
    this.sitePages = _.sortBy(haveTitles,"order");
    this.createMap();
    this.buildPage();
    this.map.setView(setView);
    this.map.fitBounds(this.markers.getBounds());
    this.map.on('locationfound', this.onLocationFound);
    this.map.on('locationerror', this.onLocationError);
  },
  methods: {
    updateHash: function(page){
      this.$router.push(page.hash);
      this.menuShown = !this.menuShown;
    },
    locate: function(){
      this.map.locate({setView: true, maxZoom: 16});
    },
    onLocationFound: function(e) {
      if (this.current.position) {
        this.map.removeLayer(this.current.position);
        this.map.removeLayer(this.current.accuracy);
      }

      var radius = e.accuracy / 2;

      this.current.position = L.marker(e.latlng).addTo(this.map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

      this.current.accuracy = L.circle(e.latlng, radius).addTo(this.map);
    },
    onLocationError: function(e) {
      alert(e.message);
    },
    buildPage: function() {
      var path = this.$route.path == '/' ? '/home/' : this.$route.path;
      path = path.replace(/^\/+|\/+$/g, '');
      var matchingpage = pages.filter(element => element['hash'].replace(/^\/+|\/+$/g, '') == path);
      if (matchingpage.length > 0){
        this.buildMapView(matchingpage[0])
      } else {
        var posts = this.mapMarkers.filter(element => element['post']['hash'].replace(/^\/+|\/+$/g, '') == path)[0];
        this.buildMapView(posts['post'], posts['marker'])
      }
    },
    createMap: function() {
      this.map = L.map('map' , {scrollWheelZoom: false}).setView([0, 0], 1);
      L.tileLayer(mapView.mapData['map-tileset'], {
        "attribution" : mapView.mapData['map-credits'],
        "minZoom" : mapView.mapData['minZoom'],
        "maxZoom" : mapView.mapData['maxZoom'],
        "errorTileUrl" : "img/error-tile-image.png",
        "subdomains" : ["a", "b", "c", "d"],
        "detectRetina" : true,
      }).addTo(this.map);
      this.createMarkers();
      this.addMarkers();
    },
    lightBox: function() {
      var images = document.getElementsByClassName("image");
      var caption = document.getElementsByClassName("caption");
      for (var i = 0; i < images.length; i++) {
          var image = images[i].querySelector('img');
          var link = image.src;
          images[i].innerHTML = "<a href='" + link + "' data-lightbox=' ' data-title='" + caption[i].innerHTML  + "'>" + image.outerHTML + "</a>";
      }

      lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
       })
    },
    addMarkers: function() {
      var groupedMarkers = _.groupBy(this.mapMarkers, function(b) { return b.group});
      var overLayers = [];
      if (this.layerControl) {
        this.layerControl.remove(this.map);
      }
      this.map.eachLayer((existinglayer) => {
        if (existinglayer.iconURL || existinglayer['_layers']){
          existinglayer.remove();
        }
      });
      this.layerControl = L.control.layers(null, null, { collapsed: true, position: 'topleft' });  
      this.markers = this.getMarkers();        
      for (var key in groupedMarkers){
        var markers = groupedMarkers[key].map(element => element['marker']);
        var image = markers[0].iconURL;
        if (this.markergrouping == 'grouped') {
          var group = L.featureGroup.subGroup(this.markers, markers);
          this.map.addLayer(this.markers);
          var name = `${image} ${key}`;
          overLayers.push({"name":key, "layer":group})
          this.layerControl.addOverlay(group, name);
          this.layerControl.addTo(this.map);
          group.addTo(this.map)
        } else if (this.markergrouping == 'single') {
         overLayers.push({"name":key, icon: image, active: true, "layer":L.layerGroup(markers)})
       }
      }
      if (this.markergrouping == 'single') {
        this.layerControl = new L.Control.PanelLayers(null, overLayers, {
          compact: true,
          collapsed: true,
          position: 'topleft'
        });
        this.map.addControl(this.layerControl);
      } else {
        this.layerControl.addTo(this.map);
      }
    },
    createMarkers: function() {
      this.mapMarkers = [];
      var items = _.groupBy(mapView.postdata, function(b) { return b.category_name});
      for (var i=0; i<mapView.postdata.length; i++){
        const post = mapView.postdata[i];
        var icon = post.leafleticon;
        var counter = post.counter >= icons.length ? 0 : post.counter;
        var iconurl = icon ? icon : baseurl + icons[counter];
        var order = post.order
        var mbox = new L.DivIcon({
          html: `<img class="my-div-image" src="${iconurl}"/>
                <span class="ordernumber">${order}</span>`,
          className: 'my-div-icon',
          iconSize : [30, 50],
          popupAnchor : [-1, 5],
        });
        var marker = L.marker([post.lat, post.lng], {
          icon: mbox,
        }).bindPopup(`<strong>${post.title}</strong><br>${post.desc }`, {offset:new L.Point(0,-30)});
        marker.iconURL = `<span class="my-div-icon" style="position:relative">${mbox.options.html}</span>`;
        var vue = this;
        marker.on('click', function(){
          vue.buildMapView(post, this);
        });
        this.mapMarkers.push({'post': post, 'marker': marker, 'group': post.category_name})
      }
    },
    buildMapView: function(post, marker=false) {
      if (this.$route.path != post.hash){
        this.$router.push(post.hash);
      }
      axios.get(post.url).then((response) => {
        this.sidebar = {'content': response.data, 'title': post.title, 'menutitle': post.menutitle,
          'marker': marker, 'date': post.date, 'author': post.author, 'header': post.header};
          this.lightBox();
      });
    },
    goToMarker: function(marker) {
      try {
        this.markers.zoomToShowLayer(marker, function () {
          marker.openPopup();
        });
      } catch(err) {
        marker.openPopup();
      }
    },
    getMarkers: function() {
      if (this.markergrouping == 'grouped') { 
        return new L.markerClusterGroup({showCoverageOnHover: false});
      } else if (this.markergrouping == 'single') {
        return new L.featureGroup();
      }
    }
  },
})

const routes = [
  { path: '/', component: mapview },
]

const router = new VueRouter({
  routes // short for `routes: routes`
})
var app = new Vue({
  router,
  el: '#app'
})
