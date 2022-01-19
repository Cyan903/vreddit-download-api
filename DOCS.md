# Docs

<img src="https://raw.githubusercontent.com/CyanPiano/Static-github/main/vreddit-download-api/url-example.png" />

#### Routes:

    / - Shows version and repo link.
    /r/[:Subreddit Name]/[:Post ID]
        - Returns video and audio downloads (if available). 


#### Example Response:

    {
        "code": 200,
        "res": {
            "id": "12345678",
            "videos": [
                {
                    "height": "240",
                    "width": "426",
                    "framerate": "30",
                    "url": "https://v.redd.it/12345678/DASH_240.mp4"
                },
                {
                    "height": "360",
                    "width": "640",
                    "framerate": "30",
                    "url": "https://v.redd.it/12345678/DASH_360.mp4"
                },
                {
                    "height": "480",
                    "width": "854",
                    "framerate": "30",
                    "url": "https://v.redd.it/12345678/DASH_480.mp4"
                },
                {
                    "height": "720",
                    "width": "1280",
                    "framerate": "30",
                    "url": "https://v.redd.it/12345678/DASH_720.mp4"
                }
            ],
            "audio": "https://v.redd.it/12345678/DASH_audio.mp4"
        }
    }

