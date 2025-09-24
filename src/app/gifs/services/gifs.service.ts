import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';


@Injectable({
    providedIn: 'root'
})
export class GifService {
    private http = inject(HttpClient);

    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal(false);

    constructor() {
        this.loadTrendingGifs();
    }

    loadTrendingGifs() {
        this.trendingGifsLoading.set(true);
        this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/trending`,{
        params: {
            api_key: environment.giphyApiKey,
            limit: 20,
        }}).subscribe((response) => {
            const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
            this.trendingGifs.set(gifs);
            this.trendingGifsLoading.set(false);
        });
    }
}