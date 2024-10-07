---
# You can also start simply with 'default'
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Vector Tiles
info: |
  ## Vector Tiles
  Workshop am Umweltbundesamt, Wien
# apply unocss classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
download: true
---

# Vector Tiles

Workshop am Umweltbundesamt, Wien

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: center
---

# Vector Tiles

* Einordnung zwischen Vektordaten und Kartendarstellung
* Wann und wo werden Vektorkacheln sinnvoll eingesetzt
* Datenaufbereitung: Mapshaper, Tippecanoe
* Möglichkeiten der Bereitstellung - statisch vs. dynamisch
* Darstellung - Mapbox Style Specification

---
layout: center
transition: slide-up
---

# Was sind Vector Tiles?

In vordefinierten Kacheln organisierte Pakete von Daten, optimiert für das Web


- <carbon-TransformBinary /> **Binäres Transfer-Format** - Mapbox Vector Tiles, basiert auf Protobuf
- <carbon-ZoomFit /> **Vereinfachung auf Pixelauflösung** - Datentransfer und Rendern beschleunigt
- <carbon-heat-map /> **Kein Feature Service** - sondern ein Darstellungsformat
- <carbon-CloudDownload /> **Reduktion auf darzustellende Daten** - Vorhersehbare Datenmenge
- <carbon-layers /> **Ganze Karte** - Ein Kachelset kann viele Datenschichten beinhalten
- <carbon-ColorPalette /> **Separater Style beschreibt die Karte** - Mapbox Style Specification


---
layout: center
transition: fade-out
---

# Im Vergleich mit WMS / WMTS und WFS / Features

|   | Tiled WMS / WMTS | WFS / Features | Vector Tiles |
| - | --- | --- | ------------ |
| Web-Format | Bild | GeoJSON | binär |
| Cache | Output | nie | Preprocess + Input |
| Style | in-image | separat | separat |
| Geometrien | nicht verfügbar | original | vereinfacht, zerhackt |
| Attribute | separat | alle | für Style nötige |
| Primäre Anwendung | Web / Darstellung | GIS / Berechnungen | Web / Darstellung |


---
layout: center
transition: fade-out
---

# Warum Vector Tiles?

Kartographisch ansprechende Karten für das Web mit guter Performance

- Einfaches Publizieren von **Karten** (Tiles + Style)
- Serverless
- Geringere Datenmenge als Image Tiles
- Hohe Bildschirmauflösungen und Head-up Ansichten
- ~~Publizieren von Geodaten~~
- ~~Editieren von Geometrien~~
- ~~Vektorbasierte GIS-Analytik~~

---
layout: quote
transition: fade-out
---

The biggest improvement in map performance is from what you choose *not to draw*
<br>
<br>
<div style="text-align: right">(Tom MacWright)</div>

---
layout: center
transition: slide-up
---

# Culling

Wegwerfen von Daten

* Auswählen aus einer großen Menge
* Beziehen aus einer Vielzahl von Quellen
* Vereinfachen

---
layout: center
transition: slide-up
---

# Beispiel OpenLayers

| | GeoJSON | Vector Tiles |
| - | ------- | ------------ |
| Einmalig beim Laden der Karte | <ul><li>Laden großer Dateien</li><li>Räumliche Indizierung im Speicher</li></ul> | |
| Beim Interagieren mit der Karte | <ul><li>Daten für den aktuell sichtbaren Extent aus dem Speicher holen</li><li>Umrechnen von geographisch/projiziert auf Bildschirmkoordinaten</li><li>Vereinfachen der Geometrien (Quantizing, Douglas-Peucker)</li><li>Filtern</li><li>Rendern</li></ul> | <ul><li>(Laden der benötigten Vector Tiles)</li><li>(Filtern)</li><li>Rendern</li></ul> |

<style>
td {
  vertical-align: top
}
</style>

---
layout: center
transition: fade-out
---

# Datenreduktion

Ziel: konstante Datenmenge pro Kachel über alle Zoomstufen

* Automatische Datenreduktion hat ihre Grenzen
* Nur Geometrien und Attribute in die Kacheln aufnehmen, die auch dargestellt werden
* Nicht jede Darstellung ist für jede Zoomstufe geeignet

Kartographie ist wesentliches Entwurfkriterium für Vector Tiles!

---
layout: quote
transition: fade-out
---

Vector Tiles sind nicht Geodaten, sondern deren darstellungsoptimierte Repräsentation
<br>
<br>
<div style="text-align: right">(Andreas Hocevar)</div>

---
layout: center
transition: slide-up
---

# Flächeninanspruchnahme 2022

https://www.data.gv.at/katalog/dataset/6b03edb4-42e9-4646-b9e6-20fa8c4797d0

🧐 Leider kein direkter Download-Link

---
layout: center
transition: slide-up
---

# Datenaufbereitung

GeoPackage 😱

```js
const crsDefinition = gp.getSpatialReferenceSystemDao();
const srsId = '31287';
const crs = crsDefinition.getBySrsId(srsId);
crs.setDefinition(`PROJCS["MGI / Austria Lambert",
  GEOGCS["MGI", DATUM["Militar-Geographische_Institut",
  SPHEROID["Bessel 1841",6377397.155,299.1528128],
  TOWGS84[577.326,90.129,463.919,5.137,1.474,5.297,2.4232]],
  PRIMEM["Greenwich",0, AUTHORITY["EPSG","8901"]],
  UNIT["degree",0.0174532925199433, AUTHORITY["EPSG","9122"]], AUTHORITY["EPSG","4312"]],
  PROJECTION["Lambert_Conformal_Conic_2SP"], PARAMETER["latitude_of_origin",47.5],
  PARAMETER["central_meridian",13.3333333333333], PARAMETER["standard_parallel_1",49],
  PARAMETER["standard_parallel_2",46], PARAMETER["false_easting",400000], PARAMETER["false_northing",400000],
  UNIT["metre",1, AUTHORITY["EPSG","9001"]], AUTHORITY["EPSG","31287"]]`);
crsDefinition.update({
  srs_name: crs.srs_name,
  srs_id: crs.srs_id,
  organization: crs.organization,
  organization_coordsys_id: crs.organization_coordsys_id,
  definition: crs.definition,
  description: crs.description
});
```

💡 Daten bitte auch als ISO GeoJSON auf data.gv.at bereitstellen

---

# Tippecanoe

https://github.com/felt/tippecanoe/

```sh
tippecanoe FI_2022_AT.geojson \
  --no-tile-compression \
  --output-to-directory=FI_2022_AT
```

```sh
For layer 0, using name "FI_2022_AT"
4320257 features, 495206405 bytes of geometry and attributes, 64 bytes of string pool, 0 bytes of vertices, 0 bytes of nodes
tile 5/17/11 size is 925420 (probably really 925420) with detail 12, >500000    
tile 6/34/22 size is 3032425 (probably really 3032425) with detail 12, >500000    
tile 6/34/22 size is 920521 (probably really 920521) with detail 11, >500000    
tile 7/67/44 size is 520833 (probably really 520833) with detail 12, >500000    
tile 7/69/45 size is 1425423 (probably really 1425423) with detail 12, >500000    
tile 7/68/44 size is 2187558 (probably really 2187558) with detail 12, >500000    
tile 7/68/44 size is 697780 (probably really 697780) with detail 11, >500000    
tile 7/69/44 has 199924 (estimated 208667) features, >200000    
Try using --drop-fraction-as-needed or --drop-densest-as-needed.


*** NOTE TILES ONLY COMPLETE THROUGH ZOOM 6 ***
```
Zu große Datenmenge auf niedrigen Zoomstufen!

---
layout: center
transition: slide-up
---

# Tippecanoe

Zweiter Versuch

Da die Features keine IDs haben, können wir die Funktion `--coalesce` verwenden.

```sh
tippecanoe FI_2022_AT.geojson \ 
  --include=FI_Code \
  --coalesce \
  --reorder \
  --detect-shared-borders \
  --low-detail=10 \
  --no-feature-limit \
  --no-tile-compression \
  --output-to-directory=FI_2022_AT
```

```sh
For layer 0, using name "FI_2022_AT"
4320257 features, 495206405 bytes of geometry and attributes, 64 bytes of string pool, 0 bytes of vertices, 0 bytes of nodes
  99.9%  14/8930/5684 
```
Funktioniert. Sind wir glücklich?

---
layout: two-cols
layoutClass: gap-16
transition: fade-out
---
<img border="rounded" src="/img/vectors.gif" alt="Vectors">

::right::

<img border="rounded" src="/img/vectortiles.gif" alt="Vector Tiles">

---
layout: two-cols
layoutClass: gap-16
transition: fade-out
---
<img border="rounded" src="/img/vectors.png" alt="Vectors">

::right::

<img border="rounded" src="/img/vectortiles.png" alt="Vector Tiles">

---
layout: two-cols
layoutClass: gap-16
transition: fade
---
<img border="rounded" src="/img/vectors-nolines.png" alt="Vectors">

::right::

<img border="rounded" src="/img/vectortiles-nolines.png" alt="Vector Tiles">

---
layout: two-cols
layoutClass: gap-16
transition: fade-out
---
<img border="rounded" src="/img/vectors-lines.png" alt="Vectors">

::right::

<img border="rounded" src="/img/vectortiles-lines.png" alt="Vector Tiles">

---
layout: image-right
image: /img/tile-chunks.gif
transition: slide-up
---

# Keine Geodaten!

Vector Tiles: Polygone und Linien sind zerstückelt, Punkte wiederholt

```js
const selection = new VectorSource();
map.addLayer(new VectorLayer({ source: selection }));

map.on('pointermove', (evt) => {
  const hit = map.getFeaturesAtPixel(
    evt.pixel,
    {layerFilter: l => l.getSource() !== selection});

  selection.clear();
  selection.addFeatures(hit);

  map.getTargetElement().title = hit.length
    ? hit[0].get('mapbox-layer').id
    : ''
});
```

---
layout: center
transition: slide-up
---

# Mapshaper

dissolve

```sh
mapshaper-xl 16gb FI_2022_AT.geojson \
  -dissolve fields=FI_Code \
  -explode \
  -o FI_2022_AT_dissolved.geojson ndjson  
```

https://github.com/mbloch/mapshaper

---
layout: center
transition: slide-up
---

# Tippecanoe

Feature IDs erzeugen

```sh
tippecanoe FI_2022_AT_dissolved.geojson \
  --low-detail=10 \
  --generate-ids \
  --output-to-directory FI_2022_AT_dissolved
```

---
layout: image-right
image: /img/tile-no-chunks.gif
---

# Zusammenhalt per ID

Einfacheres und besseres Highlighting

```js
let ids = [];
const selection = new VectorTileLayer({
  renderMode: 'vector',
  source: vectorTileSource,
  style: (f) => ids.includes(f.getId()) ? style : null
});
map.addLayer(selection);

map.on('pointermove', (evt) => {
  const hit = map.getFeaturesAtPixel(evt.pixel);
  ids = hit.map(f => f.getId());
  selection.changed();
});
```
Feature IDs zum Identifizieren der Teile zerstückelter Geometrien sind also wichtig!

---
layout: center
transition: slide-up
---

# Projektion

Web Mercator passt für Österreich

Das ganze Vector Tiles Ökosystem wurde für Web Mercator entwickelt. Andere Projektionen sind möglich (z.T. mit Hacks), führen aber zu
* Kompatibilitätsproblemen
* keinem Mehrwert für den Benutzer

---
layout: two-cols-header
layoutClass: gap-16
transition: slide-up
---

# Austria Lambert oder Web Mercator?

Heiteres Projektionenraten

::left::
<img border="rounded" src="/img/austria3857.png" alt="Welche Projektion?">

::right::

<img border="rounded" src="/img/austria31287.png" alt="Welche Projektion?">

<style>
  h1, p {
    text-align: center
  }
</style>

---
layout: center
transition: slide-up
---

# Genauigkeit von Vektorkacheln

* Grundgenauigkeit über den Zoomstufen zugeordnete Resolutions ermittelbar.<br>
  `resolution = 2 * 6378137 * Math.PI / 512 / 2 ** z` Meter/pixel<br>
  `z = 0 -> resolution = 78271.51696402048`<br>
  `z + 1 -> resolution * 2`
* `maxzoom: 14` ist bei Vector Tiles üblich<br>
  `z = 14 -> resolution = 4.777314267823516`
* Dazu kommt die Genauigkeit (`detail`) der Koordinaten in der Kachel<br>
  `tileResolution = 2 ** detail` Pixel<br>
* Default `detail: 12`<br>
  `detail = 12 -> tileResolution = 4096`
* Gerenderte Kachelgröße: 512 x 512 Pixel
* Gerenderte Kachelgröße bei *Overzoom* von z14 auf z17: 4096 x 4096 Pixel<br>
  `512 -> 1024 -> 2048 -> 4096`<br>
* `z = 17 -> resolution = 0.5971642834779395`

---
layout: center
transition: slide-up
---

# Kartographie

Karte statt Layer denken - jede Zoomstufe ist eine eigene Karte

Nicht nur bei topographischen, sondern auch bei thematischen Karten:

* Niedrige Zoomstufen bieten Überblick und Navigationshilfe
* Hohe Zoomstufen zeigen die Daten im Detail

Parzellenscharfe Daten sind bei einer Österreich-Ansicht meist nicht sinnvoll!

---
layout: two-cols
layoutClass: gap-16
transition: slide-up
---
<img border="rounded" src="/img/vectors-austria.png" alt="Vectors">

::right::

<img border="rounded" src="/img/vectortiles-austria.png" alt="Vector Tiles">

---
layout: two-cols-header
layoutClass: gap-16
transition: slide-up
---
# Flächeninanspruchnahme: 7 %

bezogen auf die Gesamtfläche Österreichs

::left::

### Original-Datensatz (QGIS)

<img border="rounded" src="/img/vectors-pixelcount.png" alt="Vectors">

71 %

::right::

### Vektorkacheln (OpenLayers)

<img border="rounded" src="/img/vectortiles-pixelcount.png" alt="Vector Tiles">

27 %

<style>
  h1, h2, h3, p {
    text-align: center
  }
</style>

---
layout: center
transition: slide-up
---

# Andere Darstellung für niedrige Zoomstufen

Überblick und Navigation

* 10.000 x 10.000 m Raster der Statistik Austria
  https://data.statistik.gv.at/data/OGDEXT_RASTER_1_STATISTIK_AUSTRIA_L010000_LAEA.zip
* Einfacher Join der beanspruchten Flächen auf die Rasterzellen 

---
layout: center
transition: slide-up
---

# Mapshaper

Aufbereitung Raster und Join

```sh
mapshaper data/STATISTIK_AUSTRIA_RASTER_L010000.shp \
  -proj EPSG:4326 \
  -filter-fields gid \
  -o data/raster_10000.geojson ndjson precision=0.0000001
```

```sh
mapshaper-xl 16gb data/raster_10000.geojson \
  -join source=data/FI_2022_AT.geojson point-method calc='area=sum(FLAECHE)' \
  -o data/FI_2022_AT_raster_10000.geojson ndjson 
```

---
layout: center
transition: slide-up
---

![Raster Flächeninanspruchnahme](/img/austria-grid-fi.png)

---
transition: slide-up
---

<img src="/img/austria-grid-styled.png">

---
layout: center
transition: slide-up
---

# Tippecanoe

Mehrere `source-layer`

```sh
tippecanoe \
  data/FI_2022_AT_raster_10000.geojson \
  data/FI_2022_AT_dissolved.geojson \
  --generate-ids \
  --output-to-directory data/FI_2022_AT
```

```sh
For layer 0, using name "FI_2022_AT_raster_10000"
For layer 1, using name "FI_2022_AT_dissolved"
1859619 features, 364291795 bytes of geometry and attributes, 31975 bytes of string pool, 0 bytes of vertices, 0 bytes of nodes
tile 6/34/22 size is 1308669 (probably really 1308669) with detail 12, >500000    
tile 7/69/45 size is 588897 (probably really 588897) with detail 12, >500000    
tile 7/68/44 size is 957516 (probably really 957516) with detail 12, >500000    
tile 7/69/44 size is 2348493 (probably really 2348493) with detail 12, >500000  
...
```

Unnötig viele Daten, weil alles in allen Zoomstufen.

---
layout: center
---

# Tippecanoe tile-join

Kombinieren mehrerer Datensätze

```sh
tippecanoe data/FI_2022_AT_raster_10000.geojson \
  --maximum-zoom=10 \
  --generate-ids \
  --output data/FI_2022_AT_raster_10000.pmtiles
```

```sh
tippecanoe data/FI_2022_AT_dissolved.geojson \
  --minimum-zoom=11 \
  --generate-ids \
  --output data/FI_2022_AT_dissolved.pmtiles
```

```sh
tile-join -output-to-directory data/FI_2022_AT.pmtiles \
  data/FI_2022_AT_raster_10000.pmtiles \
  data/FI_2022_AT_dissolved.pmtiles
```

---
layout: center
transition: slide-up
---

# PMTiles

*"An open archive format for pyramids of tile data, accessible via HTTP Range Requests"*<br>
https://docs.protomaps.com

* Serverless (wie Cloud Optimized GeoTIFF)
* Schnelle Bereitstellung (z.B. auf S3)
* Decodieren per Serverless Function oder im Client

💡 Bei Bereitstellung der Tiles nach extern empfiehlt sich [Decodieren per Serverless Function](https://docs.protomaps.com/deploy/) (z.B. [DigitalOcean](https://github.com/ahocevar/do-function-pmtiles/)), ansonsten ist Decodieren im Client (z.B. [OpenLayers](https://github.com/openlayers/ol-mapbox-style/blob/8e76623dca95a3d607c01be39ab8d35e4c2e3802/examples/pmtiles.js) oder [MapLibre](https://docs.protomaps.com/pmtiles/maplibre)) einfacher und meist auch schneller.

---
layout: center
---

# Bereitstellung von Vector Tiles



|                | Kompatbilität | Upload | Performance | Kosten |
| -------------- | ------------- | ------ | ----------- | ------ |
| Ordnerstruktur | 👍 | 👎 | 👍 | 👍 |
| PMTiles direkt | 👎 | 👍 | 👍 | 👍 |
| PMTiles mit Serverless Function | 👍 | 👍 | 👍 | 👍 |
| [MBTiles](https://github.com/consbio/mbtileserver) | 👍 | 👍 | 👍 | 👎 |
| [GeoPackage](https://gitlab.com/imagemattersllc/ogc-vtp2/-/blob/master/extensions/2-mvte.adoc) | 👍 | 👍 | 👍 | 👎 |
| Dynamisch (z.B. [GeoServer](https://docs.geoserver.org/stable/en/user/extensions/vectortiles/install.html)) | 👎 | 👍 | 👎 | 👎 |

<style>
  td {
    text-align: center;
  }
  td:nth-child(1) {
    text-align: left;
  }
</style>

---
layout: center
transition: slide-up
---

# Immer mit Style

[Mapbox Style Specification](https://docs.mapbox.com/style-spec/guides/)

* Gut les- und schreibbar von Mensch und Maschine
* Beschreibt die ganze Karte
* "Layer"-Begriff wie in Zeichenprogrammen

---
layout: center
transition: slide-up
---

# Mapbox Style JSON Struktur

Anatomie einer Kartenbeschreibung

```json
{
  "version": "8",
  "sprite": "",
  "glyphs": "https://orangemug.github.io/font-glyphs/glyphs/{fontstack}/{range}.pbf",
  "sources": {},
  "layers": []
}
```

---
layout: center
transition: slide-up
---

# Sources

Woher kommen die Daten, und von welchem Typ sind sie?

```json
{
  "Basemap Ortho": {
    "type": "raster",
    "tiles": ["https://mapsneu.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg"],
    "tileSize": 256,
    "maxzoom": 19
  },
  "FI_2022_AT": {
    "type": "vector",
    "url": "https://example.com/tiles/FI_2022_AT"
  }
}
```

`"url"` zeigt auf ein TileJSON:

```json
{
  "tiles": ["https://example.com/tiles/FI_2022_AT/{z}/{x}/{y}.mvt"],
  "maxzoom": 14
}
```

---
layout: center
transition: slide-up
---

# Layers

Komposition der gesamten Karte in "painter's order"

```json
[{
  "id": "Basemap Ortho",
  "type": "raster",
  "source": "Basemap Ortho"
}, {
  "id": "Orientierungsraster",
  "type": "fill",
  "source": "FI_2022_AT",
  "source-layer": "FI_2022_AT_raster_10000",
  "maxzoom": 11,
  "paint": { "fill-color": [ "interpolate", ["linear"], ["/", ["get", "area"], 10000000],
      0, "rgba(0, 255, 0, 0.5)", 1, "rgba(220, 220, 220, 1)"]}
}, {
  "id": "Autobahn und Schnellstraße"
  "filter": ["==", "FI_Code", 101],
  "type": "fill",
  "source": "FI_2022_AT",
  "source-layer": "FI_2022_AT_dissolved",
  "minzoom": 11,
  "paint": { "fill-color": "rgba(0, 0, 0, 0.7)" }
}]

```

---
layout: center
transition: slide-up
---

# Übernahme von Styles aus QGIS

basierend auf SLD-Export und GeoStyler

```sh
npx geostyler-cli -s se -t mapbox --output out.json in.sld
```

![GeoStyler](/img/geostyler.gif)

<style>
  img {
    padding-left: 15%;
    padding-right: 15%;
  }
</style>

---
layout: center
transition: slide-up
---

# Maputnik

Grafischer Editor mit Macken

![Maputnik](./img/maputnik.png)

https://maputnik.github.io/

<style>
  img {
    height: 50vh;
  }
</style>

---
layout: center
---

# Mapbox Studio

Perfekter Style-Editor

Gedacht für Verwendung mit den Diensten von Mapbox

https://mapbox.com/studio/

---
layout: center
class: text-center
---

# Unterlagen

https://ahocevar.net/uba-vectortiles-slides/ · [Slide Sources](https://github.com/ahocevar/uba-vectortiles-slides/) · [Demo App](https://github.com/ahocevar/uba-vectortiles/)<br><br><carbon-Email /> [mail@ahocevar.com](mailto:mail@ahocevar.com)

<PoweredBySlidev mt-10 />
