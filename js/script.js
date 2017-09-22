//Define os atributos do mapa e insere o meu token do mopbox
var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
              '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
              'Imagery © <a href="http://mapbox.com">Mapbox</a>',
              mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3Jla3RvIiwiYSI6ImNqNTVucjU1dzBkZjMyeHQ2OTYzcmY2bHgifQ.8QZMKxtCMwU-fTFwnIiYAA';

//Define os mapas do mapbox e difine as respectivas variáveis de acesso.
var dark   = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
    streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});
    satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite',   attribution: mbAttr});
    outdoors = L.tileLayer(mbUrl, {id: 'mapbox.outdoors',   attribution: mbAttr});

//Cria o mapa
var mymap = L.map('mapid', {
    center: [-15.7940, -47.8831],
    // center: [-15.773, -47.759],Centralizar no DF
    zoom: 14,
    zoomControl: false, //Não inclui o zoom default do leaflet
    layers: [streets]
    });

//Cria o miniMap no canppo inferior direito - obs. foi definido um novo mapa aqui: osm
var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data &copy; OpenStreetMap contributors';
//Plugin magic goes here! Note that you cannot use the same layer object again, as that will confuse the two map controls
var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 18, attribution: osmAttrib });
var miniMap = new L.Control.MiniMap(osm, { toggleDisplay: true }).addTo(mymap);

//Add measure plugin ao projeto
var measureControl = L.control.measure({
  position: 'topright',
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqmeters',
  secondaryAreaUnit: undefined,
  activeColor: '#c0067b',
  completedColor: '#ff92b5'
});
measureControl.addTo(mymap);

//Add leaflet.zoomhome plugin ao projeto
var zoomHome = L.Control.zoomHome();
zoomHome.addTo(mymap);

//Add scale ao mapa
L.control.scale({imperial: false}).addTo(mymap);

var serv_hidro = 'https://www.geoservicos1.segeth.df.gov.br/arcgis/rest/services/Hidrografia/HIDROGRAFIA/MapServer';

//Atribui a primeira layer do grupo a variável rioprin
var rioprin = L.esri.dynamicMapLayer({
  url: serv_hidro,

  layers: [1],//Carrega uma layer específica em um group layers
  useCors: false
});

//Atribui a terceira layer do grupo a variável lagos
var lagos = L.esri.dynamicMapLayer({
  url: serv_hidro,
  layers: [2],//Carrega uma layer específica em um group layers
  useCors: false
});

var serv_lote_ocupa = 'https://www.geoservicos1.segeth.df.gov.br/arcgis/rest/services/Cadastro/LOTE_SITURB_OCUPACAO/MapServer';

//Atribui a layer lote_ocupa
var lote_ocupa = L.esri.dynamicMapLayer({
  url: serv_lote_ocupa,
  layers: [0],//Carrega uma layer específica em um group layers
  useCors: false
});


var areavermelha = 'https://www.geoservicos1.segeth.df.gov.br/arcgis/rest/services/Limites/AREAS_VERMELHAS/MapServer';

//Atribui a layer de limite do Combate a Grilagem e Ocupação Irregulares
var limgrila = L.esri.dynamicMapLayer({
  url: areavermelha,
  layers: [0],//Carrega uma layer específica em um group layers
  useCors: false,
  opacity: 0.5
});

var baseimage2016 =  'https://www.geoservicos.segeth.df.gov.br/ArcGIS/rest/services/Basemap/Foto_2016/MapServer';

//Atribui a layer Foto Aérea 2016
var base2016 = L.esri.dynamicMapLayer({
  url: baseimage2016,
  layers: [0],//Carrega uma layer específica em um group layers
  useCors: false
});


//************************************SEÇÃO DE POPUPS*****************************

rioprin.bindPopup(function (error, featureCollection) {
  if(error || featureCollection.features.length === 0) {
    return false;
  } else {
    return 'Nome do Rio: ' + featureCollection.features[0].properties.nome;
  }
});

lagos.bindPopup(function (error, featureCollection) {
  if(error || featureCollection.features.length === 0) {
    return false;
  } else {
    return 'Nome do lago: ' + featureCollection.features[0].properties.nome;
  }
});

lote_ocupa.bindPopup(function (error, featureCollection) {
  if(error || featureCollection.features.length === 0) {
    return false;
  } else {
   return     'Setor: ' + featureCollection.features[0].properties.setor + '</br>' +
             'Quadra: ' + featureCollection.features[0].properties.quadra + '</br>' +
             'Conjunto: ' + featureCollection.features[0].properties.conjunto + '</br>' +
             'Lote: ' + featureCollection.features[0].properties.lote + '</br>' +
             'Endereço: ' + featureCollection.features[0].properties.endereco + '</br>' +
             ' Complemento: ' + featureCollection.features[0].properties.end_comp + '</br>' +
             'Cep: ' + featureCollection.features[0].properties.cep + '</br>' +
             'Situação: ' + featureCollection.features[0].properties.situacao + '</br>' +
             'Reg. Administrativa: ' + featureCollection.features[0].properties.ra;
      }
    });


//************************************SEÇÃO DE CONTROL LAYERS*****************************

//Cria os objetos para conter as layers que estarão no control layers
var baseLayers = {
  "Mapabase Cinza Escuro": dark,
  "Mapabase de Ruas": streets,
  "Mapabase de Imagem Aérea" : satellite,
  "Mapabase de Ruas e Locais" : outdoors
};

var overlays = {
  "Rios Pincipais": rioprin,
  "Lagos e Lagoas": lagos,
  "Lote Ocupação": lote_ocupa,
  "Limite Grilagem e Ocupação Irregular": limgrila,
  "Foto Aérea 2016": base2016
};

// http://leafletjs.com/reference-1.0.3.html#control-layers
L.control.layers(baseLayers,overlays).addTo(mymap);


//************************************SEÇÃO DE LEGENDAS*****************************

// htmllegend Plugin
var htmlLegend = L.control.htmllegend({
  position: 'bottomright',

  legends: [{
    name: 'Rios Principais',
    layer: rioprin,
    elements: [{
      html: '',
      style: {
        "background-color": "#0C6CB6",
        "width": "15px",
        "height": "2px"
      }
    }]
  },{
    name: 'Lagos e Lagoas',
    layer: lagos,
    elements: [{
      html: '',
      style: {
        "background-color": "#97DBF2",
        "width": "15px",
        "height": "15px"
      }
    }]
  },{
    name: 'Lote - Ocupação',
    layer: lote_ocupa,
    elements: [{
        // label: 'Lote - Ocupação',
        html: '',
        style: {
          "background-color": "#FFEABE",
          "width": "15px",
          "height": "15px"
        }
      }]
    }, {
      name: 'Mapa de Combate a Grilagem e Ocupação Irregulares ',
      layer: limgrila,
      opacity: 0.5,
      elements: [{
        html: '',
        style: {
          "background-color": "#FF7F7F",
          "width": "15px",
          "height": "15px"
        }
      }]
    }],
    collapseSimple: true,
    detectStretched: true,
    collapsedOnInit: true,
    defaultOpacity: 0.7,
    visibleIcon: 'icon icon-eye',
    hiddenIcon: 'icon icon-eye-slash'
  });
mymap.addControl(htmlLegend);


//**********************SEÇÃO DE IDENTIFICAÇÃO DE FEIÇÃO***********************

var identifiedFeature;
// var pane = document.getElementById('selectedFeatures');

mymap.on('click', function (e) {
  if (!mymap.hasLayer(lote_ocupa)) {
      return;
    }
    else if(identifiedFeature){
      mymap.removeLayer(identifiedFeature);
      // pane.innerText = 'Loading';
    }
    lote_ocupa.identify().on(mymap).at(e.latlng).run(function(error, featureCollection){
      identifiedFeature = new L.GeoJSON(featureCollection.features[0], {
        style: function(){
          return {
            color: '#5C7DB8',
            weight: 2
          };
        }
      }).addTo(mymap);
      // pane.innerText = 'Lote: ' +  featureCollection.features[0].properties.Lote;
    });
  });

  mymap.on('click', function (e) {
    if (!mymap.hasLayer(rioprin)) {
        return;
      }
      else if(identifiedFeature){
        mymap.removeLayer(identifiedFeature);
      }
      rioprin.identify().on(mymap).at(e.latlng).run(function(error, featureCollection){
        identifiedFeature = new L.GeoJSON(featureCollection.features[0], {
          style: function(){
          }
        }).addTo(mymap);
      });
    });

    mymap.on('click', function (e) {
      if (!mymap.hasLayer(lagos)) {
          return;
        }
        else if(identifiedFeature){
          mymap.removeLayer(identifiedFeature);
        }
        lagos.identify().on(mymap).at(e.latlng).run(function(error, featureCollection){
          identifiedFeature = new L.GeoJSON(featureCollection.features[0], {
            style: function(){
              return {
                color: '#5C7DB8',
                weight: 2
              };
            }
          }).addTo(mymap);
        });
      });
