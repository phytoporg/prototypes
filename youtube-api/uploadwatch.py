from auth import *
from burnt_toast import *
from deps import *
import argparse
import os
import json
import time
from datetime import datetime

# Time to wait between upload checks if we haven't detected any in-progress
# videos yet.
DEFAULT_POLLING_FREQUENCY_SECONDS = 200

# Turn on for debugging
ENABLE_LOGS = False

def _log(string):
    if ENABLE_LOGS:
        print(string)

def _collect_processing_videos(yt, playlist_id):
    request = yt.playlistItems().list(part='contentDetails', playlistId=playlist_id, maxResults=20)
    result = request.execute()

    video_ids = []
    for item in result['items']:
        video_ids.append(item['contentDetails']['videoId'])

    request = yt.videos().list(
        part='status,snippet,processingDetails,suggestions',
        id=','.join(video_ids),
        maxResults=len(video_ids))
    result = request.execute()

    completed_videos = []
    processing_videos = []
    for item in result['items']:
        processing_details = item['processingDetails']
        snippet = item['snippet']
        status = item['status']

        if item['processingDetails']['processingStatus'] == 'processing':
            processing_videos.append(item)
        else:
            completed_videos.append(item)

    return completed_videos, processing_videos

def _snippet_published_datetime(video):
    # e.g. 2021-01-28T20:55:14Z
    return datetime.strptime(video['snippet']['publishedAt'], '%Y-%m-%dT%H:%M:%SZ')

def main(args):
    assert args.secrets_file
    assert os.path.exists(args.secrets_file)
    yt = get_authenticated_service(args.secrets_file)

    print('Running UploadWatch. Press CTRL+C to stop.')

    # Get a list of the 10 most recently uploaded videos for this user at a low 
    # frequency (once every 10 minutes).
    request = yt.channels().list(mine=True, part='contentDetails')
    result = request.execute()

    assert 'items' in result
    assert 'contentDetails' in result['items'][0]
    playlist_id = result['items'][0]['contentDetails']['relatedPlaylists']['uploads']

    wait_time_seconds = DEFAULT_POLLING_FREQUENCY_SECONDS
    completed_videos, processing_videos = _collect_processing_videos(yt, playlist_id)
    while True:
        _log(f'Found {len(processing_videos)} processing videos after waiting {wait_time_seconds} seconds.')
        if len(processing_videos) > 0:
            _log(json.dumps(processing_videos[0], indent=4))
            if 'processingProgress' in processing_videos[0]['processingDetails']:
                next_to_complete = \
                    min(
                        processing_videos,
                        key = lambda x : int(x['processingDetails']['processingProgress']['timeLeftMs']))
                next_wait_time_seconds = \
                    int(next_to_complete['processingDetails']['processingProgress']['timeLeftMs']) * 1000
            else:
                next_wait_time_seconds = DEFAULT_POLLING_FREQUENCY_SECONDS
        else:
            next_wait_time_seconds = DEFAULT_POLLING_FREQUENCY_SECONDS
        time.sleep(next_wait_time_seconds)

        last_completed_item = max(completed_videos, key=_snippet_published_datetime)
        completed_videos, processing_videos = _collect_processing_videos(yt, playlist_id)

        # Check if we've published anything new since the last time we checked
        next_completed_item = max(completed_videos, key=_snippet_published_datetime)
        if next_completed_item != last_completed_item:
            newly_completed = \
                [c for c in completed_videos \
                    if _snippet_published_datetime(c) > _snippet_published_datetime(last_completed_item)]

            for newly_completed in newly_completed:
                print(json.dumps(newly_completed, indent=4))
                processing_details = newly_completed['processingDetails']
                video_title = newly_completed['snippet']['title']
                if processing_details['processingStatus'] == 'failed':
                    _log(json.dumps(newly_completed), indent=4)
                    signal_toast('Upload failed', video_title)
                elif processing_details['processingStatus'] == 'succeeded':    
                    signal_toast('Upload succeeded', video_title)
                    _log(f'Succeeded: {video_title}')
        else:
            _log('Found no successfully processed videos since we last checked.')

if __name__ == '__main__':
    print('Checking installation dependencies. You may get a prompt for elevated privileges.')
    get_dependencies()
    print('Done!')

    parser = argparse.ArgumentParser()
    parser.add_argument('--secrets-file', type=str, required=True)

    main(parser.parse_args())
