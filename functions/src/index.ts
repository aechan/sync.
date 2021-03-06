import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as request from 'request';


const format = (a: string, args: string[]) => {
    for (let k in args) {
        a = a.replace("{" + k + "}", args[k])
    }
    return a
};


class CrunchyrollAPI {
    // CR vars
    private API_URL = "https://api.crunchyroll.com/{0}.0.json";
    private API_DEFAULT_LOCALE = "en_US";
    private API_USER_AGENT = "Mozilla/5.0 (iPhone; iPhone OS 8.3.0; {0})";
    private API_HEADERS = {
        "Host": "api.crunchyroll.com",
        "Accept-Encoding": "gzip, deflate",
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded"
    };
    private API_VERSION = "2313.8";
    private API_ACCESS_TOKEN = "QWjz212GspMHH9h";
    private API_DEVICE_TYPE = "com.crunchyroll.iphone";
    private STREAM_WEIGHTS = {
        "low": 240,
        "mid": 420,
        "high": 720,
        "ultra": 1080,
    };
    private STREAM_NAMES = {
        "120k": "low",
        "328k": "mid",
        "864k": "high"
    };

    private URL_REGEX = new RegExp("http(s)?:\/\/(\w+\.)?crunchyroll\.(?:com|de|es|fr|co.jp)(?:\/[^\/&?]+)?\/[^\/&?]+-(?P<media_id>\d+)");

    private session_id = null;

    api_call = (entrypoint: string, params, schema=null) => {
        let url = format(this.API_URL, [entrypoint]);

        // set default params
        params['version'] = this.API_VERSION;
        params['locale'] = this.API_DEFAULT_LOCALE.replace('_', '');
        
        if(this.session_id) {
            params['session_id'] = this.session_id;
        }

        let headers = this.API_HEADERS;
        headers['User-Agent'] = format(this.API_USER_AGENT, [this.API_DEFAULT_LOCALE]);

        let res = null;
        request.get(url, (error, resp, body) => {
            if (!error && resp.statusCode == 200) {
                res = resp;
            }
        });
    }

}


export const crunchyRoll = functions.https.onRequest((req, res) => {
    const url = req.body;

    let cr = new CrunchyrollAPI();
    
})