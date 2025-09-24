import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search',
  imports: [GifListComponent],
  templateUrl: './search.component.html',
})
export default class SearchComponent { 

  gifService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query:string) {
    this.gifService.searchGifs(query).subscribe((response) => {
      this.gifs.set(response);
    });
  }
}
