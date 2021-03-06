/**
 * Core functionality for the BALDR songbook without node dependencies.
 * @module @bldr/songbook-core
 */
import { sortObjectsByProperty, formatWikidataUrl, formatWikipediaUrl, formatYoutubeUrl } from '@bldr/core-browser';
/**
 * A tree of songs where the song arrays are placed in alphabetical properties.
 * An instanace of this class would look like this example:
 *
 * <pre><code>
 * {
 *   "a": [ song, song ],
 *   "s": [ song, song ],
 *   "z": [ song, song ]
 * }
 * </code></pre>
 */
export class AlphabeticalSongsTree {
    /**
     * @param songs - An array of song objects.
     */
    constructor(songs) {
        for (const song of songs) {
            if (!{}.hasOwnProperty.call(this, song.abc))
                this[song.abc] = [];
            this[song.abc].push(song);
        }
        for (const abc in this) {
            this[abc].sort(sortObjectsByProperty('songId'));
        }
    }
}
/**
 * Combine and transform some song metadata properties.
 *
 * Mapping
 *
 * - title: title (year)
 * - subtitle: subtitle - alias - country
 * - composer: composer, artist, genre
 * - lyricist: lyricist
 */
export class SongMetaDataCombined {
    /**
     * @param songMetaData - A song
     * metadata object.
     */
    constructor(songMetaData) {
        /**
         * The raw metadata object originating from the info.yml file.
         */
        this.metaData_ = songMetaData;
        /**
         * All property names of all getters as an array.
         */
        this.allProperties = [
            'composer',
            'lyricist',
            'musescoreUrl',
            'subtitle',
            'title',
            'wikidataUrl',
            'wikipediaUrl',
            'youtubeUrl'
        ];
    }
    /**
     * An array of external sites a song is linked to. Each external site has
     * its ...URL property.
     */
    static externalSites() {
        return [
            'musescore',
            'wikidata',
            'wikipedia',
            'youtube'
        ];
    }
    /**
     * Extract values of given properties of an object and collect it in
     * an array.
     *
     * @params {array} properties - Some object properties to collect strings from.
     * @params {object} object - An object.
     *
     * @private
     */
    static collectProperties_(properties, object) {
        const parts = [];
        for (const property of properties) {
            if (property in object && object[property]) {
                parts.push(object[property]);
            }
        }
        return parts;
    }
    /**
     * Format: `composer, artist, genre`
     */
    get composer() {
        let properties;
        if (this.metaData_.composer === this.metaData_.artist) {
            properties = ['composer', 'genre'];
        }
        else {
            properties = ['composer', 'artist', 'genre'];
        }
        return SongMetaDataCombined.collectProperties_(properties, this.metaData_).join(', ');
    }
    /**
     * Return the lyricist only if it is not the same as in the fields
     * `artist` and `composer`.
     *
     * Format: `lyricist`
     */
    get lyricist() {
        if (this.metaData_.lyricist &&
            this.metaData_.lyricist !== this.metaData_.artist &&
            this.metaData_.lyricist !== this.metaData_.composer) {
            return this.metaData_.lyricist;
        }
    }
    /**
     * For example: `https://musescore.com/score/1234`
     */
    get musescoreUrl() {
        if (this.metaData_.musescore) {
            return `https://musescore.com/score/${this.metaData_.musescore}`;
        }
    }
    /**
     * Format: `subtitle - alias - country`
     */
    get subtitle() {
        return SongMetaDataCombined.collectProperties_(['subtitle', 'alias', 'country'], this.metaData_).join(' - ');
    }
    /**
     * title (year)
     */
    get title() {
        let out;
        if (this.metaData_.title) {
            out = this.metaData_.title;
        }
        else {
            out = '';
        }
        if (this.metaData_.year) {
            return `${out} (${this.metaData_.year})`;
        }
        return out;
    }
    /**
     * For example: `https://www.wikidata.org/wiki/Q42`
     */
    get wikidataUrl() {
        if (this.metaData_.wikidata) {
            return formatWikidataUrl(this.metaData_.wikidata);
        }
    }
    /**
     * For example: `https://en.wikipedia.org/wiki/A_Article`
     */
    get wikipediaUrl() {
        if (this.metaData_.wikipedia) {
            return formatWikipediaUrl(this.metaData_.wikipedia);
        }
    }
    /**
     * For example: `https://youtu.be/CQYypFMTQcE`
     */
    get youtubeUrl() {
        if (this.metaData_.youtube) {
            return formatYoutubeUrl(this.metaData_.youtube);
        }
    }
    toJSON() {
        return {
            title: this.title,
            subtitle: this.subtitle,
            composer: this.composer,
            lyricist: this.lyricist
        };
    }
}
/**
 * The song library - a collection of songs
 */
export class CoreLibrary {
    constructor(songs) {
        this.songs = songs;
        this.songIds = Object.keys(this.songs).sort();
        this.currentSongIndex = 0;
    }
    toArray() {
        return Object.values(this.songs);
    }
    /**
     * @returns {array}
     */
    toDynamicSelect() {
        const result = [];
        for (const songId of this.songIds) {
            const song = this.getSongById(songId);
            result.push({ id: song.songId, name: song.metaData.title });
        }
        return result;
    }
    /**
     * Count the number of songs in the song library
     */
    countSongs() {
        return this.songIds.length;
    }
    /**
     * Update the index of the song IDs array. If a song is opened via the search
     * form, it is possible to go to the next or previous song of the opened song.
     *
     * @returns The index in the songIds array.
     */
    updateCurrentSongIndex(songId) {
        this.currentSongIndex = this.songIds.indexOf(songId);
        return this.currentSongIndex;
    }
    /**
     * Sort alphabetically an array of objects by some specific property.
     *
     * @param property Key of the object to sort.
     * @see {@link https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript Tutorial}
     */
    sortByProperty_(property) {
        return function (a, b) {
            return a[property].localeCompare(b[property]);
        };
    }
    /**
     * Get the song object from the song ID.
     *
     * @param songId - The ID of the song. (The parent song folder)
     */
    getSongById(songId) {
        if (songId in this.songs && this.songs[songId]) {
            return this.songs[songId];
        }
        else {
            throw new Error(`There is no song with the songId: ${songId}`);
        }
    }
    /**
     * Get the previous song
     */
    getPreviousSong() {
        if (this.currentSongIndex === 0) {
            this.currentSongIndex = this.countSongs() - 1;
        }
        else {
            this.currentSongIndex -= 1;
        }
        return this.getSongById(this.songIds[this.currentSongIndex]);
    }
    /**
     * Get the next song
     */
    getNextSong() {
        if (this.currentSongIndex === this.countSongs() - 1) {
            this.currentSongIndex = 0;
        }
        else {
            this.currentSongIndex += 1;
        }
        return this.getSongById(this.songIds[this.currentSongIndex]);
    }
    /**
     * Get a random song.
     */
    getRandomSong() {
        const randomIndex = Math.floor(Math.random() * this.songIds.length);
        if (this.currentSongIndex !== randomIndex) {
            return this.getSongById(this.songIds[randomIndex]);
        }
        else {
            return this.getNextSong();
        }
    }
    toJSON() {
        return this.songs;
    }
}
