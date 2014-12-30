/**
 * scripts/main.js
 *
 * This is the starting point for your application.
 * Take a look at http://browserify.org/ for more info
 */

'use strict';

var curlconverter = require('curlconverter');


document.addEventListener('DOMContentLoaded', function(){
  var convertButton = document.getElementById('convert-button');
    convertButton.addEventListener('click', function() {


    var curlCode = document.getElementById('curl-code').value;
    var pythonCode;
    if (curlCode.indexOf('curl') === -1) {
      pythonCode = 'Could not parse curl command.';
    } else {
      try {
      pythonCode = curlconverter.toPython(curlCode);
      } catch(e) {
        console.log(e);
        pythonCode = 'Error parsing curl command.';
      }
    }
    document.getElementById('python-code').value = pythonCode;
  });
});
