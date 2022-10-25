import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoom: number = 14;
  center: [number, number] = [-74.57742785991677, -8.40922204116471];

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoom
    });

    this.mapa.on('zoom', () => {
      this.zoom = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', () => {
      if( this.mapa.getZoom() > 18 ) {
        this.mapa.zoomTo(18);
      };
    });

    // Movimiento de Mapa
    this.mapa.on('move',(event) =>{
      const target = event.target;
      const { lng , lat} = target.getCenter();

      this.center = [lng, lat];
    })

  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomCambio(value: string) {
    this.mapa.zoomTo( Number(value) )
  }

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }


}
