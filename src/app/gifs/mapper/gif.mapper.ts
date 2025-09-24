import { Gif } from "../interfaces/gif.interface";
import { GiphyItem } from "../interfaces/giphy.interfaces";

export class GifMapper {
    static toGif(giphyItem: GiphyItem): Gif {
        return {
            id: giphyItem.id,
            url: giphyItem.images.fixed_width.url,
            title: giphyItem.title,
        };
    }

    static mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[] {
        return items.map(this.toGif);
    }
}