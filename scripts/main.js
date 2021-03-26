'use strict'

var curlconverter = require('curlconverter')

document.addEventListener('DOMContentLoaded', function () {
  var hash = window.location.hash.replace('#', '')
  if (hash === 'node-fetch') {
    changeLanguage('node-fetch')
  } else if (hash === 'node-request') {
    changeLanguage('node-request')
  } else if (hash === 'php') {
    changeLanguage('php')
  } else if (hash === 'browser') {
    changeLanguage('browser')
  } else if (hash === 'r') {
    changeLanguage('r')
  } else if (hash === 'go') {
    changeLanguage('go')
  } else if (hash === 'strest') {
    changeLanguage('strest')
  } else if (hash === 'java') {
    changeLanguage('java')
  } else if (hash === 'json') {
    changeLanguage('json')
  } else if (hash === 'rust') {
    changeLanguage('rust')
  } else if (hash === 'dart') {
    changeLanguage('dart')
  } else if (hash === 'ansible') {
    changeLanguage('ansible')
  } else if (hash === 'matlab') {
    changeLanguage('matlab')
  }

  var curlCodeInput = document.getElementById('curl-code')
  curlCodeInput.addEventListener('keyup', convert)

  // listen for change in select
  var languageSelect = document.getElementById('language')
  languageSelect.addEventListener('change', function () {
    var language = document.getElementById('language').value
    changeLanguage(language)
    if (document.getElementById('curl-code').value) {
      convert()
    }
  })

  var getExample = document.getElementById('get-example')
  getExample.addEventListener('click', function () {
    showExample("curl 'http://en.wikipedia.org/' -H 'Accept-Encoding: gzip, deflate, sdch' " +
      "-H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' " +
      "-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' " +
      "-H 'Referer: http://www.wikipedia.org/' " +
      " -H 'Connection: keep-alive' --compressed")
  })

  var postExample = document.getElementById('post-example')
  postExample.addEventListener('click', function () {
    showExample("curl 'http://fiddle.jshell.net/echo/html/' -H 'Origin: http://fiddle.jshell.net' " +
      "-H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8' " +
      "-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/39.0.2171.95 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' " +
      "-H 'Accept: */*' -H 'Referer: http://fiddle.jshell.net/_display/' -H 'X-Requested-With: XMLHttpRequest' " +
      "-H 'Connection: keep-alive' --data 'msg1=wow&msg2=such' --compressed")
  })

  var basicAuthExample = document.getElementById('basic-auth-example')
  basicAuthExample.addEventListener('click', function () {
    showExample('curl "https://api.test.com/" -u "some_username:some_password"')
  })
})

/*
single point of truth in the dom, YEEEE HAWWWW
 */
var changeLanguage = function (language) {
  var generatedCodeTitle = document.getElementById('generated-code-title')

  if (language === 'node-fetch') {
    generatedCodeTitle.innerHTML = 'Node (fetch)'
  } else if (language === 'node-request') {
    generatedCodeTitle.innerHTML = 'Node (request)'
  } else if (language === 'php') {
    generatedCodeTitle.innerHTML = 'PHP requests'
  } else if (language === 'browser') {
    generatedCodeTitle.innerHTML = 'Browser (fetch)'
  } else if (language === 'ansible') {
    generatedCodeTitle.innerHTML = 'Ansible URI'
  } else if (language === 'r') {
    generatedCodeTitle.innerHTML = 'R httr'
  } else if (language === 'go') {
    generatedCodeTitle.innerHTML = 'Go'
  } else if (language === 'strest') {
    generatedCodeTitle.innerHTML = 'Strest'
  } else if (language === 'rust') {
    generatedCodeTitle.innerHTML = 'Rust'
  } else if (language === 'elixir') {
    generatedCodeTitle.innerHTML = 'Elixir'
  } else if (language === 'dart') {
    generatedCodeTitle.innerHTML = 'Dart'
  } else if (language === 'java') {
    generatedCodeTitle.innerHTML = 'Java'
  } else if (language === 'json') {
    generatedCodeTitle.innerHTML = 'JSON'
  } else if (language === 'matlab') {
    generatedCodeTitle.innerHTML = 'MATLAB'
  } else {
    generatedCodeTitle.innerHTML = 'Python requests'
  }
  window.location.hash = '#' + language
  var languageSelect = document.getElementById('language')
  languageSelect.value = language

  return language
}

var getLanguage = function () {
  var languageSelect = document.getElementById('language')
  return languageSelect.value
}

var convert = function () {
  var curlCode = document.getElementById('curl-code').value
  var generatedCode
  if (curlCode.indexOf('curl') === -1) {
    generatedCode = 'Could not parse curl command.'
  } else {
    try {
      var language = getLanguage()
      if (language === 'node-fetch') {
        generatedCode = curlconverter.toNodeFetch(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tonodefetch')
      } else if (language === 'node-request') {
        generatedCode = curlconverter.toNodeRequest(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tonoderequests')
      } else if (language === 'php') {
        generatedCode = curlconverter.toPhp(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tophp')
      } else if (language === 'browser') {
        generatedCode = curlconverter.toBrowser(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tobrowser')
      } else if (language === 'r') {
        generatedCode = curlconverter.toR(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tor')
      } else if (language === 'go') {
        generatedCode = curlconverter.toGo(curlCode)
        window['ga']('send', 'event', 'convertcode', 'togo')
      } else if (language === 'strest') {
        generatedCode = curlconverter.toStrest(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tostrest')
      } else if (language === 'rust') {
        generatedCode = curlconverter.toRust(curlCode)
        window['ga']('send', 'event', 'convertcode', 'torust')
      } else if (language === 'elixir') {
        generatedCode = curlconverter.toElixir(curlCode)
        window['ga']('send', 'event', 'convertcode', 'toelixir')
      } else if (language === 'dart') {
        generatedCode = curlconverter.toDart(curlCode)
        window['ga']('send', 'event', 'convertcode', 'todart')
      } else if (language === 'java') {
        generatedCode = curlconverter.toJava(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tojava')
      } else if (language === 'json') {
        generatedCode = curlconverter.toJsonString(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tojson')
      } else if (language === 'ansible') {
        generatedCode = curlconverter.toAnsible(curlCode)
        window['ga']('send', 'event', 'convertcode', 'toansible')
      } else if (language === 'matlab') {
        generatedCode = curlconverter.toMATLAB(curlCode)
        window['ga']('send', 'event', 'convertcode', 'tomatlab')
      } else {
        generatedCode = curlconverter.toPython(curlCode)
        window['ga']('send', 'event', 'convertcode', 'topython')
      }
      hideIssuePromo()
    } catch (e) {
      console.log(e)
      if (curlCode.indexOf('curl') !== 0) {
        generatedCode = 'Error parsing curl command. Your input should start with the word "curl"'
      } else {
        generatedCode = 'Error parsing curl command.'
      }
      window['ga']('send', 'event', 'convertcode', 'parseerror')
      showIssuePromo()
    }
  }
  document.getElementById('generated-code').value = generatedCode
}

var showIssuePromo = function () {
  document.getElementById('issue-promo').style.display = 'inline-block'
}

var hideIssuePromo = function () {
  document.getElementById('issue-promo').style.display = 'none'
}

var showExample = function (code) {
  document.getElementById('curl-code').value = code
  convert()
}
