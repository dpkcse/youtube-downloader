var express = require('express');
var router = express.Router();
var _ = require('lodash');
/* GET home page. */

// default endpoint
router.get('/', function(req, res) {
  res.render('index', { title: 'Youtube Downloader' });
// new endpoint
});

// utility function to convert bytes to human readable.
function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var ytdl = require('youtube-dl');
router.post('/video', function(req, res, next) {
  var url = req.body.url,formats = [];
    
  ytdl.getInfo(url, ['--youtube-skip-dash-manifest'], function(err, info) {
    var res_data = [];
    res_data.title = 'Youtube video downloader';
    res_data._ = _;
    
    if(err){
      res_data.error = 'The link you provided either not a valid url or it is not acceptable';
    }else{
      res_data.error = 'NA';
      info.formats.forEach(function(item) {
          if(item.format_note !== 'DASH audio' && item.filesize) {
              item.filesize = item.filesize ? bytesToSize(item.filesize): 'unknown';
              formats.push(item);
          }
      });
      res_data.id = info.id;
      res_data.data = formats;
    }

    res.render('listvideo', res_data);
  });

});


module.exports = router;
