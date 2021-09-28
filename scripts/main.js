import * as curlconverter from 'curlconverter'

// TODO: put the curl input in the URL?
// TODO: syntax highlight text boxes
// TODO: update screenshots and include OS-specific Chrome screenshots
// TODO: un-minify CSS
// TODO: option to pre-fill new GitHub Issue with input (and output?) when clicking "create an issue"

// TODO: library names should be links
const languages = {
  ansible: [curlconverter.toAnsible, 'Ansible URI'],
  browser: [curlconverter.toBrowser, 'Browser (fetch)'],
  dart: [curlconverter.toDart, 'Dart'],
  elixir: [curlconverter.toElixir, 'Elixir'],
  go: [curlconverter.toGo, 'Go'],
  java: [curlconverter.toJava, 'Java'],
  json: [curlconverter.toJsonString, 'JSON'],
  matlab: [curlconverter.toMATLAB, 'MATLAB'],
  'node-fetch': [curlconverter.toNodeFetch, 'Node (fetch)'],
  'node-request': [curlconverter.toNodeRequest, 'Node (request)'],
  php: [curlconverter.toPhp, 'PHP requests'],
  python: [curlconverter.toPython, 'Python requests'],
  r: [curlconverter.toR, 'R httr'],
  rust: [curlconverter.toRust, 'Rust'],
  strest: [curlconverter.toStrest, 'Strest']
}

const changeLanguage = function (language) {
  const generatedCodeTitle = document.getElementById('generated-code-title')

  generatedCodeTitle.innerHTML = languages[language][1]

  window.location.hash = '#' + language

  const languageSelect = document.getElementById('language')
  languageSelect.value = language

  return language
}

const getLanguage = function () {
  const languageSelect = document.getElementById('language')
  return languageSelect.value
}

const showIssuePromo = function () {
  document.getElementById('issue-promo').style.display = 'inline-block'
}

const hideIssuePromo = function () {
  document.getElementById('issue-promo').style.display = 'none'
}

const showExample = function (code) {
  document.getElementById('curl-code').value = code
  convert()
}

const convert = function () {
  const curlCode = document.getElementById('curl-code').value
  let generatedCode
  if (curlCode.indexOf('curl') === -1) {
    generatedCode = 'Could not parse curl command.'
  } else {
    try {
      const language = getLanguage()
      const converter = languages[language][0]
      generatedCode = converter(curlCode)

      const event = converter.name.toLowerCase().replace('tojsonstring', 'tojson')
      window.ga('send', 'event', 'convertcode', event)

      hideIssuePromo()
    } catch (e) {
      console.error(e)
      if (curlCode.indexOf('curl') !== 0) {
        generatedCode = 'Error parsing curl command. Your input should start with the word "curl"'
      } else {
        generatedCode = 'Error parsing curl command.'
      }
      window.ga('send', 'event', 'convertcode', 'parseerror')
      showIssuePromo()
    }
  }
  document.getElementById('generated-code').value = generatedCode
}

const hash = window.location.hash.replace('#', '')
if (Object.prototype.hasOwnProperty.call(languages, hash)) {
  changeLanguage(hash)
}

const curlCodeInput = document.getElementById('curl-code')
curlCodeInput.addEventListener('keyup', convert)

// listen for change in select
const languageSelect = document.getElementById('language')
languageSelect.addEventListener('change', function () {
  const language = document.getElementById('language').value
  changeLanguage(language)
  if (document.getElementById('curl-code').value) {
    convert()
  }
})

const getExample = document.getElementById('get-example')
getExample.addEventListener('click', function () {
  showExample("curl 'http://en.wikipedia.org/' -H 'Accept-Encoding: gzip, deflate, sdch' " +
    "-H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36' " +
    "-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' " +
    "-H 'Referer: http://www.wikipedia.org/' " +
    " -H 'Connection: keep-alive' --compressed")
})

const postExample = document.getElementById('post-example')
postExample.addEventListener('click', function () {
  showExample("curl 'http://fiddle.jshell.net/echo/html/' -H 'Origin: http://fiddle.jshell.net' " +
    "-H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8' " +
    "-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/39.0.2171.95 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' " +
    "-H 'Accept: */*' -H 'Referer: http://fiddle.jshell.net/_display/' -H 'X-Requested-With: XMLHttpRequest' " +
    "-H 'Connection: keep-alive' --data 'msg1=wow&msg2=such&msg3=data' --compressed")
})

const basicAuthExample = document.getElementById('basic-auth-example')
basicAuthExample.addEventListener('click', function () {
  showExample('curl "https://api.test.com/" -u "some_username:some_password"')
})
