import 'bootstrap'
import hljs from 'highlight.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'github-fork-ribbon-css/gh-fork-ribbon.css'
import 'normalize.css'

import 'highlight.js/styles/github.css'

import './main.css'

import * as curlconverter from 'curlconverter'

// TODO: include a Windows screenshot. Firefox and Safari have "copy as cURL" as well
//
// TODO: put the curl input in the URL?
// TODO: print a diff of the raw resulting requests?

// TODO: translate the site. The top languages are
// chinese
// russian
// portuguese
// japanese
// korean
// french
// spanish

const languages = {
  ansible: { converter: curlconverter.toAnsible, name: 'Ansible URI', hljs: 'yaml' },
  dart: { converter: curlconverter.toDart, name: 'Dart', hljs: 'dart' },
  elixir: { converter: curlconverter.toElixir, name: 'Elixir', hljs: 'elixir' },
  go: { converter: curlconverter.toGo, name: 'Go', hljs: 'go' },
  java: { converter: curlconverter.toJava, name: 'Java', hljs: 'java' },
  javascript: { converter: curlconverter.toBrowser, name: 'JavaScript', hljs: 'javascript' },
  json: { converter: curlconverter.toJsonString, name: 'JSON', hljs: 'json' },
  matlab: { converter: curlconverter.toMATLAB, name: 'MATLAB', hljs: 'matlab' },
  'node-fetch': { converter: curlconverter.toNodeFetch, name: 'Node (fetch)', hljs: 'javascript' },
  'node-request': { converter: curlconverter.toNodeRequest, name: 'Node (request)', hljs: 'javascript' },
  php: { converter: curlconverter.toPhp, name: 'PHP requests', hljs: 'php' },
  python: { converter: curlconverter.toPython, name: 'Python requests', hljs: 'python' },
  r: { converter: curlconverter.toR, name: 'R httr', hljs: 'r' },
  rust: { converter: curlconverter.toRust, name: 'Rust', hljs: 'rust' },
  strest: { converter: curlconverter.toStrest, name: 'Strest', hljs: 'yaml' }
}

const changeHighlight = (language) => {
  if (languages[language] && languages[language].hljs) {
    language = languages[language].hljs
  }
  const newClass = 'language-' + language

  let seen = false
  const generatedCodeEl = document.getElementById('generated-code')
  for (const cls of generatedCodeEl.classList) {
    if (cls === newClass) {
      seen = true
    } else if (cls.startsWith('language-')) {
      generatedCodeEl.classList.remove(cls)
    }
  }
  if (!seen) {
    generatedCodeEl.classList.add(newClass)
  }

  hljs.highlightElement(generatedCodeEl)
}

const changeLanguage = function (language) {
  window.location.hash = '#' + language

  const languageSelect = document.getElementById('language')
  languageSelect.value = language

  changeHighlight(language)

  return language
}

const getLanguage = function () {
  const languageSelect = document.getElementById('language')
  return languageSelect.value
}

const showIssuePromo = (errorMsg) => {
  const issuePromo = document.getElementById('issue-promo')

  const curlCode = document.getElementById('curl-code').value
  const prefilledIssue = document.getElementById('prefilled-issue')
  if (errorMsg && curlCode && curlCode.length <= 2000) {
    const link = new URL('https://github.com/curlconverter/curlconverter/issues/new')
    const params = new URLSearchParams({
      title: 'Error: "' + errorMsg + '"',
      body: '**Input**:\n\n```sh\n' + curlCode + '\n```\n\n**Expected output**:\n\n'
    })
    link.search = params
    prefilledIssue.getElementsByTagName('a')[0].href = link.toString()
    prefilledIssue.style.display = 'inline-block'
  } else {
    prefilledIssue.style.display = 'none'
  }

  issuePromo.style.display = 'inline-block'
}

const hideIssuePromo = () => {
  document.getElementById('issue-promo').style.display = 'none'
}

const showCopyToClipboard = () => {
  document.getElementById('copy-to-clipboard').style.display = 'inline-block'
}

const hideCopyToClipboard = () => {
  document.getElementById('copy-to-clipboard').style.display = 'none'
}

const showExample = function (code) {
  document.getElementById('curl-code').value = code
  convert()
}

const convert = function () {
  let curlCode = document.getElementById('curl-code').value
  let generatedCode
  let error
  const language = getLanguage()

  // Convert the placeholder text as a demo
  if (!curlCode) {
    curlCode = 'curl example.com'
  }

  if (!curlCode.trim()) {
    error = ''
    hideIssuePromo()
    hideCopyToClipboard()
  } else if (curlCode.indexOf('curl') === -1) {
    error = 'Could not parse curl command.'
  } else {
    try {
      const converter = languages[language].converter
      generatedCode = converter(curlCode).trimEnd() // remove trailling newline
      hideIssuePromo()
      showCopyToClipboard()
    } catch (e) {
      console.error(e)
      const origErrorMsg = e.toString()
      error = 'Error parsing curl command'
      if (curlCode.indexOf('curl') !== 0) {
        error += '. Your input should start with the word "curl"'
      } else if (origErrorMsg) {
        error += ':\n' + origErrorMsg
      }
      changeHighlight('plaintext')
      showIssuePromo(origErrorMsg)
      hideCopyToClipboard()
    }
  }
  const generatedCodeEl = document.getElementById('generated-code')
  if (!error) {
    generatedCodeEl.textContent = generatedCode
    changeHighlight(language)
  } else {
    generatedCodeEl.textContent = error
    changeHighlight('plaintext')
  }
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
  convert()
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

const copyToClipboardEl = document.getElementById('copy-to-clipboard')
copyToClipboardEl.addEventListener('click', (event) => {
  const generatedCodeEl = document.getElementById('generated-code')
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(generatedCodeEl)
  selection.removeAllRanges()
  selection.addRange(range)

  navigator.clipboard.writeText(generatedCodeEl.textContent)
})

convert()
