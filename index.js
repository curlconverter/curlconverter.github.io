import 'bootstrap'
import hljs from 'highlight.js'
import { detect } from 'detect-browser'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'github-fork-ribbon-css/gh-fork-ribbon.css'
import 'normalize.css'

import 'highlight.js/styles/github.css'

import './main.css'

import getExampleTemplate from './examples/get.sh'
import postExampleTemplate from './examples/post.sh'
import authExampleText from './examples/auth.sh'

import * as curlconverter from 'curlconverter'

// TODO: include a Windows screenshot. Firefox and Safari have "copy as cURL" as well
//
// TODO: put the curl input in the URL?
// TODO: print a diff of the raw resulting requests?
//
// TODO: add check box for scanning the clipboard

// TODO: translate the site. The top languages are
// chinese
// russian
// portuguese
// japanese
// korean
// french
// spanish

// https://techblog.willshouse.com/2012/01/03/most-common-user-agents/
let useragent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
// For fun and future-proofing, put the user's
// actual User Agent in the examples
if (window.navigator &&
    window.navigator.userAgent &&
    window.navigator.userAgent.trim() &&
    !/[^a-z0-9-/().;, _]/i.test(window.navigator.userAgent)) {
  useragent = window.navigator.userAgent
}

const getExampleText = getExampleTemplate.replace('{{useragent}}', useragent)
const postExampleText = postExampleTemplate.replace('{{useragent}}', useragent)

const languages = {
  ansible: { converter: curlconverter.toAnsibleWarn, name: 'Ansible URI', hljs: 'yaml' },
  // TODO: not supported by highlight.js
  cfml: { converter: curlconverter.toCFMLWarn, name: 'CFML', hljs: 'javascript' },
  dart: { converter: curlconverter.toDartWarn, name: 'Dart', hljs: 'dart' },
  elixir: { converter: curlconverter.toElixirWarn, name: 'Elixir', hljs: 'elixir' },
  go: { converter: curlconverter.toGoWarn, name: 'Go', hljs: 'go' },
  java: { converter: curlconverter.toJavaWarn, name: 'Java', hljs: 'java' },
  javascript: { converter: curlconverter.toBrowserWarn, name: 'JavaScript', hljs: 'javascript' },
  json: { converter: curlconverter.toJsonStringWarn, name: 'JSON', hljs: 'json' },
  matlab: { converter: curlconverter.toMATLABWarn, name: 'MATLAB', hljs: 'matlab' },
  'node': { converter: curlconverter.toNodeWarn, name: 'Node (fetch)', hljs: 'javascript' },
  'node-request': { converter: curlconverter.toNodeRequestWarn, name: 'Node (request)', hljs: 'javascript' },
  php: { converter: curlconverter.toPhpWarn, name: 'PHP requests', hljs: 'php' },
  python: { converter: curlconverter.toPythonWarn, name: 'Python requests', hljs: 'python' },
  r: { converter: curlconverter.toRWarn, name: 'R httr', hljs: 'r' },
  rust: { converter: curlconverter.toRustWarn, name: 'Rust', hljs: 'rust' },
  strest: { converter: curlconverter.toStrestWarn, name: 'Strest', hljs: 'yaml' }
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

  const navbar = document.getElementById('language-navbar')
  if (language === 'plaintext') {
    navbar.classList.add('error')
  } else {
    navbar.classList.remove('error')
  }

  hljs.highlightElement(generatedCodeEl)
}

const changeLanguage = function (language) {
  window.location.hash = '#' + language

  const languageSelect = document.getElementById('language-select')
  languageSelect.value = language

  const languageNavbar = document.getElementById('language-navbar')
  // const newActiveElem = e.target.classList.contains('dropdown-item') ? : e.target
  const newActiveElem = languageNavbar.querySelector(`a[href="#${language}"]`)
  for (const item of languageNavbar.querySelectorAll('.nav-link, .dropdown-item')) {
    item.classList.remove('active')
  }
  newActiveElem.classList.add('active')
  if (newActiveElem.classList.contains('dropdown-item')) {
    const parent = newActiveElem.parentElement.parentElement.parentElement.getElementsByClassName('dropdown-toggle')[0]
    if (parent) {
      parent.classList.add('active')
    }
  }

  document.getElementById('language-select').value = language

  changeHighlight(language)

  return language
}

const getLanguage = function () {
  const languageSelect = document.getElementById('language-select')
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
  document.getElementById('curl-code').value = code.trim()
  convert()
}

const convert = function () {
  let curlCode = document.getElementById('curl-code').value
  let generatedCode
  let warnings
  let error
  const language = getLanguage()

  // Convert the placeholder text as a demo
  if (!curlCode) {
    curlCode = 'curl example.com'
  }
  // If command starts with a non-breaking space, replace all of them with a space
  if (curlCode.startsWith('curl\u00A0')) {
    curlCode = curlCode.replace(/\u00A0/g, ' ')
  }

  if (!curlCode.trim()) {
    error = ''
    hideIssuePromo()
    hideCopyToClipboard()
  } else if (curlCode.indexOf('curl') === -1) {
    error = 'Could not parse curl command.'
  } else {
    try {
      const converter = languages[language].converter;
      [generatedCode, warnings] = converter(curlCode);
      generatedCode = generatedCode.trimEnd() // remove trailling newline
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
  const warningsEl = document.getElementById('warnings')
  if (!error) {
    generatedCodeEl.textContent = generatedCode
    changeHighlight(language)
    if (warnings && warnings.length) {
      warningsEl.textContent = warnings.map(w => w[1]).join('\n')
      warningsEl.style.display = 'inline-block'
    } else {
      warningsEl.textContent = ''
      warningsEl.style.display = 'none'
    }
  } else {
    generatedCodeEl.textContent = error
    changeHighlight('plaintext')
    warningsEl.textContent = ''
    warningsEl.style.display = 'none'
  }
}

let hash = window.location.hash.replace('#', '')
// backwards compatibility
if (hash === 'browser') {
  hash = 'javascript'
} else if (hash === 'node-fetch') {
  hash = 'node'
}
if (Object.prototype.hasOwnProperty.call(languages, hash)) {
  changeLanguage(hash)
}

const curlCodeInput = document.getElementById('curl-code')
curlCodeInput.addEventListener('keyup', convert)

// listen for change in select
const languageSelect = document.getElementById('language-select')
languageSelect.addEventListener('change', function () {
  const language = document.getElementById('language-select').value
  changeLanguage(language)
  convert()
})

const languageNavbar = document.getElementById('language-navbar')
const languageNavbarItems = languageNavbar.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item')
for (const navbarItem of languageNavbarItems) {
  navbarItem.addEventListener('click', function (e) {
    e.preventDefault()

    const language = e.target.href.split('#')[1]

    changeLanguage(language)
    convert()
  })
}

const getExamples = document.getElementsByClassName('get-example')
for (const getExample of getExamples) {
  getExample.addEventListener('click', function (e) {
    e.preventDefault() // Don't scroll to the top of the page
    showExample(getExampleText)
  })
}

const postExamples = document.getElementsByClassName('post-example')
for (const postExample of postExamples) {
  postExample.addEventListener('click', function (e) {
    e.preventDefault()
    showExample(postExampleText)
  })
}

const basicAuthExamples = document.getElementsByClassName('basic-auth-example')
for (const basicAuthExample of basicAuthExamples) {
  basicAuthExample.addEventListener('click', function (e) {
    e.preventDefault()
    showExample(authExampleText)
  })
}

const copyToClipboardEl = document.getElementById('copy-to-clipboard')
copyToClipboardEl.addEventListener('click', (e) => {
  e.preventDefault()
  const generatedCodeEl = document.getElementById('generated-code')
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(generatedCodeEl)
  selection.removeAllRanges()
  selection.addRange(range)

  navigator.clipboard.writeText(generatedCodeEl.textContent)
})

const browsers = ['chrome', 'safari', 'firefox']
let userBrowser = 'chrome'
try {
  const detectedBrowser = detect()
  if (detectedBrowser && detectedBrowser.name && browsers.includes(detectedBrowser.name)) {
    userBrowser = detectedBrowser.name
  }
} catch {}

const showInstructions = function (browser) {
  if (!browsers.includes(browser)) {
    browser = userBrowser
  }
  for (const b of browsers) {
    const el = document.getElementById(b)
    if (b === browser) {
      el.classList.remove('d-none')
    } else {
      el.classList.add('d-none')
    }
  }
}

for (const b of browsers) {
  const basicAuthExamples = document.getElementsByClassName('to-' + b)
  for (const basicAuthExample of basicAuthExamples) {
    basicAuthExample.addEventListener('click', function (e) {
      e.preventDefault()
      const browser = [...e.target.classList].filter(c => c.startsWith('to-'))
      if (browser.length) {
        showInstructions(browser[0].replace(/^to-/, ''))
      } else {
        showInstructions()
      }
    })
  }
}

convert()
showInstructions()
