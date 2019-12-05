var express = require('express');
var router = express.Router();
let rp = require('request-promise');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch')

const headersToPass = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("rendering home page");
    res.render('index', { title: 'Express' });
});


//integration endpoint
router.get('/callOic', function(req, res, next) {

      //make api call to integration endpoint
      const options = {
        method: 'GET',
        uri: 'integration endpoint',
        headers: headersToPass,
        json: true,
  
      }
  
      rp(options)
        .then(function(parsedBody) {
          console.log(parsedBody.items)
          // POST succeeded...
          //console.log('result getPurchaseQuotes-----', parsedBody)
          res.json(parsedBody);
        })
        .catch(function(err) {
          // POST failed...
          res.json(err);
        });

});


router.post('/callFromOic', function(req, res, next) {

    console.log("in callFromOic");
    console.log(req.body);

    //collect the json from oic
    let data = req.body.message;

    //display the data from oic in frontend - call yourself and show data
    
    //how to call your own self without looking like an idiot
    req.url = '/responseFromOic?message='+data;
    
    localStorage.setItem('message', data);

    res.end();
    // express._router.handle(req, res, next);
});


router.get('/responseFromOic', function(req, res, next) {

    //check if local storage is working fine
    console.log(localStorage.getItem('message'));

    let msg = localStorage.getItem('message');
    res.render('responseFromOic', { title: 'Express', message: msg });
});


module.exports = router;
