import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.service';


@Component({
  selector: 'app-trending',
  //imports: [GifListComponent],
  templateUrl: './trending.component.html',
})
export default class TrendingComponent {
  
  gifService = inject(GifService);
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollDiv;
    if(scrollTop + clientHeight + 250 >= scrollHeight) {
      this.gifService.loadTrendingGifs();
    }
  }
 }
