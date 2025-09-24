import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadGifsFromLocalStorage = () => {
    const gifs = localStorage.getItem(GIF_KEY);
    return gifs ? JSON.parse(gifs) : [];
}

//El método **computed de @angular/core en Angular 20 sirve para crear señales derivadas 
// (valores reactivos de solo lectura) que se recalculan automáticamente cuando cambian 
// las señales de las que dependen.
// El método .pipe() se usa sobre un Observable (en este caso, el que devuelve HttpClient.get) 
// para encadenar operadores de RxJS y así transformar, filtrar, o interceptar los valores 
// que emite ese observable antes de entregarlos al subscribe().
// map → transforma los datos que pasan por el observable (como el .map() de arrays, pero para streams).
// Primero extrae data de la respuesta.
// Luego convierte esos items al modelo que tu app necesita.
// tap → ejecuta un efecto secundario (algo que no transforma los datos, solo hace algo "extra").
// En este caso, guarda los resultados en el historial de búsquedas.
// Es útil para logging, métricas, side-effects.
@Injectable({
    providedIn: 'root'
})
export class GifService {
    private http = inject(HttpClient);

    trendingGifs = signal<Gif[]>([]);
    trendingGifsLoading = signal(false);
    searchGifsLoading = signal(false);

    searchHistory = signal<Record<string, Gif[]>>(loadGifsFromLocalStorage());
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

    constructor() {
        this.loadTrendingGifs();
    }

    saveGifToLocalStorage = effect(() => {
        localStorage.setItem(GIF_KEY, JSON.stringify(this.searchHistory()));
    });

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

    searchGifs(query:string):Observable<Gif[]> {
        //this.searchGifsLoading.set(true);
        return this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/search`,{
            params: {
                api_key: environment.giphyApiKey,
                q: query,
                limit: 20,
            }
        }).pipe(
            map(({data}) => data),
            map((items) => {
                return GifMapper.mapGiphyItemsToGifArray(items);
            }),
            tap((items   ) => {
                this.searchHistory.update(prev => ({...prev, [query.toLowerCase()]: items,}));
            })
        )
    }

    getHistoryGifs(query:string):Gif[] {
        return this.searchHistory()[query] ?? [];
    }
}