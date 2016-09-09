'use strict';

var curlconverter = require('curlconverter');


document.addEventListener('DOMContentLoaded', function() {
  var hash = window.location.hash.replace('#', '');
  if ('node' === hash) {
    changeLanguage('node');
  } else if ('php' === hash) {
    changeLanguage(('php'));
  }

  var curlCodeInput = document.getElementById('curl-code');
  curlCodeInput.addEventListener('keyup', convert);

  // listen for change in select
  var languageSelect = document.getElementById('language');
  languageSelect.addEventListener('change', function() {
    var language = document.getElementById('language').value;
    changeLanguage(language);
    if (document.getElementById('curl-code').value) {
      convert();
    }
  });
});


/*
single point of truth in the dom, YEEEE HAWWWW
 */
var changeLanguage = function(language) {
  var generatedCodeTitle = document.getElementById('generated-code-title');

  if (language === 'node') {
    generatedCodeTitle.innerHTML = 'Node.js';
  } else if (language === 'php') {
    generatedCodeTitle.innerHTML = 'PHP requests';
  } else {
    generatedCodeTitle.innerHTML = 'Python requests';
  }
  window.location.hash = '#' + language;
  var languageSelect = document.getElementById('language');
  languageSelect.value = language;

  return language;
};

var getLanguage = function() {
  var languageSelect = document.getElementById('language');
  return languageSelect.value;
};

var convert = function() {
  var curlCode = document.getElementById('curl-code').value;
  var generatedCode;
  if (curlCode.indexOf('curl') === -1) {

    generatedCode = 'Could not parse curl command.';
  } else {
    try {
      var language = getLanguage();
      if (language === 'node') {
        generatedCode = curlconverter.toNode(curlCode);
        window['ga']('send', 'event', 'convertcode', 'tonode');
      } else if (language == 'php') {
        generatedCode = curlconverter.toPhp(curlCode);
        window['ga']('send', 'event', 'convertcode', 'tophp');
      } else {
        generatedCode = curlconverter.toPython(curlCode);
        window['ga']('send', 'event', 'convertcode', 'topython');
      }
      hideIssuePromo();
    } catch(e) {
      console.log(e);
      generatedCode = 'Error parsing curl command.';
      window['ga']('send', 'event', 'convertcode', 'parseerror');
      showIssuePromo();
    }
  }
  document.getElementById('generated-code').value = generatedCode;
};


var showIssuePromo = function() {
  document.getElementById('issue-promo').style.display = "inline-block";
};

var hideIssuePromo = function() {
  document.getElementById('issue-promo').style.display = "none";
};
