import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from '@/app/shared/services/scroll-state.service';


@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
})
export default class TrendingComponent implements AfterViewInit{
  
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollPosition();
  }

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollDiv;
    this.scrollStateService.trendingScrollPosition.set(scrollTop);
    if(scrollTop + clientHeight + 250 >= scrollHeight) {
      this.gifService.loadTrendingGifs();
    }
  }
 }
