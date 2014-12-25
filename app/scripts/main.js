/**
 * scripts/main.js
 *
 * This is the starting point for your application.
 * Take a look at http://browserify.org/ for more info
 */

'use strict';

var curlconverter = require('curlconverter');
var $ = require('jquery-browserify');
$(function() {
  $('#convert-button').on('click', function() {
    var curlCode = $('#curl-code').val();
    var pythonCode;
    if (curlCode.indexOf('curl') === -1) {
      pythonCode = 'Could not parse curl command.';
    } else {
      pythonCode = curlconverter.toPython(curlCode);
    }
    $('#python-code').val(pythonCode);

  });
});
