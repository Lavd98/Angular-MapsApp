import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoom: number = 14;
  center: [number, number] = [-74.57742785991677, -8.40922204116471];

  marcadoresArray:MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoom
    });

    this.leerLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'HolaMundo';

    // const marker = new mapboxgl.Marker()
    //   .setLngLat(this.center)
    //   .addTo( this.mapa )

  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({draggable: true, color: color})
      .setLngLat( this.center)
      .addTo ( this.mapa )

      this.marcadoresArray.push({
        color,
        marker: nuevoMarcador
      });


    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () =>{
      this.guardarMarcadoresLocalStorage();
    });

  }

  irMarcador(marker: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker.getLngLat()
    });
  }

  guardarMarcadoresLocalStorage() {

    const lngLatArr: MarcadorColor[] = [];

    this.marcadoresArray.forEach( x => {
      const color = x.color;
      const {lng, lat} = x.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      })
    })

    localStorage.setItem( 'marcadores', JSON.stringify(lngLatArr) )
  }

  leerLocalStorage() {
    if( !localStorage.getItem('marcadores') ) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse( localStorage.getItem('marcadores')! );
    lngLatArr.forEach( x => {
      const newMarker = new mapboxgl.Marker({
        color: x.color,
        draggable: true
      })
      .setLngLat( x.centro! )
      .addTo( this.mapa );
    
    this.marcadoresArray.push({
      marker: newMarker,
      color: x.color
    });

    newMarker.on('dragend', () =>{
      this.guardarMarcadoresLocalStorage();
    });

    })
  }

  borrarMarcador(i: number) {
    this.marcadoresArray[i].marker?.remove();
    this.marcadoresArray.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
