/**
 * Created by eygle on 5/6/17.
 */

interface IEygleFile extends IModel {
    filename: string;
    ext: string;
    size: number;
    path: string;
    normalized: string;
    mtime: Date;

    episode: IEpisode;
    movie: IMovie;

    parent: IEygleFile;

    mediaInfo: {
        title: string;
        season: number;
        episode: number;
        episodeName: string;
        year: number;
        region: string;
        language: string;
        resolution: string;
        repack: boolean;
        quality: string;
        proper: boolean;
        hardcoded: boolean;
        extended: boolean;
        codec: string;
        audio: string;
        group: string;

        excess: [{
            type: string;
        }];
    }

    // View
    loading: boolean;
    selected: boolean;
    directory: IEygleFile;
    children: Array<IEygleFile>;
}