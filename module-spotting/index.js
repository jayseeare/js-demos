const express = require('express')
const fs = require('fs');
const showdown = require('showdown');

const app = express()
const port = 3000

const textPromise = new Promise((resolve, reject) => {
  fs.readFile('README.md', { encoding: 'utf8' }, (err, content) => {
    if(err) {
      reject(err);
      return;
    }

    const converter = new showdown.Converter();
    converter.setFlavor('github');
    const htmlContent = converter.makeHtml(content);
    resolve(htmlContent);
  });
});

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/public" } );
});

app.get('/markdown', function(req, res, next) {
  textPromise.then((htmlContent) => {
    res.type('html');
    res.send(htmlContent);
  }).catch(next);
});

app.use(express.static('public'));

app.listen(port, () => console.log(`Listening on port ${port}`))