import 'bootstrap'
import { detect } from 'detect-browser'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'github-fork-ribbon-css/gh-fork-ribbon.css'
import 'normalize.css'

import 'highlight.js/styles/github.css'

import hljs from 'highlight.js/lib/core'
import dart from 'highlight.js/lib/languages/dart'
import elixir from 'highlight.js/lib/languages/elixir'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import matlab from 'highlight.js/lib/languages/matlab'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import r from 'highlight.js/lib/languages/r'
import ruby from 'highlight.js/lib/languages/ruby'
import rust from 'highlight.js/lib/languages/rust'
import yaml from 'highlight.js/lib/languages/yaml'

import './main.css'

import getExampleTemplate from './examples/get.sh'
import postExampleTemplate from './examples/post.sh'
import authExampleText from './examples/auth.sh'

import * as curlconverter from 'curlconverter'

hljs.registerLanguage('dart', dart)
hljs.registerLanguage('elixir', elixir)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('matlab', matlab)
hljs.registerLanguage('php', php)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('python', python)
hljs.registerLanguage('r', r)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('yaml', yaml)

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
  ansible: { converter: curlconverter.toAnsibleWarn, hljs: 'yaml' },
  // TODO: not supported by highlight.js
  cfml: { converter: curlconverter.toCFMLWarn, hljs: 'javascript' },
  dart: { converter: curlconverter.toDartWarn, hljs: 'dart' },
  elixir: { converter: curlconverter.toElixirWarn, hljs: 'elixir' },
  go: { converter: curlconverter.toGoWarn, hljs: 'go' },
  java: { converter: curlconverter.toJavaWarn, hljs: 'java' },
  javascript: { converter: curlconverter.toJavaScriptWarn, hljs: 'javascript' },
  json: { converter: curlconverter.toJsonStringWarn, hljs: 'json' },
  matlab: { converter: curlconverter.toMATLABWarn, hljs: 'matlab' },
  'node-fetch': { converter: curlconverter.toNodeWarn, hljs: 'javascript' },
  'node-axios': { converter: curlconverter.toNodeAxiosWarn, hljs: 'javascript' },
  'node-request': { converter: curlconverter.toNodeRequestWarn, hljs: 'javascript' },
  php: { converter: curlconverter.toPhpWarn, hljs: 'php' },
  python: { converter: curlconverter.toPythonWarn, hljs: 'python' },
  r: { converter: curlconverter.toRWarn, hljs: 'r' },
  ruby: { converter: curlconverter.toRubyWarn, hljs: 'ruby' },
  rust: { converter: curlconverter.toRustWarn, hljs: 'rust' },
  strest: { converter: curlconverter.toStrestWarn, hljs: 'yaml' }
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
  window.history.replaceState('', '', '/' + language)

  const languageSelect = document.getElementById('language-select')
  languageSelect.value = language

  const languageNavbar = document.getElementById('language-navbar')
  // const newActiveElem = e.target.classList.contains('dropdown-item') ? : e.target
  const newActiveElem = languageNavbar.querySelector(`a[href="/${language}"]`)
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
  window.sessionStorage.setItem('prev-curl-command', curlCode)
  let generatedCode
  let error
  const language = getLanguage()
  let warnings = []

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
  } else {
    try {
      const converter = languages[language].converter;
      [generatedCode, warnings] = converter(curlCode, warnings)
      generatedCode = generatedCode.trimEnd() // remove trailing newline
      hideIssuePromo()
      showCopyToClipboard()
    } catch (e) {
      console.error(e)
      const origErrorMsg = e.toString()
      if (origErrorMsg) {
        if (origErrorMsg.startsWith('Error: ')) {
          error = origErrorMsg
        } else {
          error = 'Error parsing curl command: ' + origErrorMsg
        }
      } else if (!curlCode.trim().startsWith('curl')) {
        error = 'Error parsing curl command. Your input should start with the word "curl"'
      } else {
        error = 'Error parsing curl command.'
      }
      changeHighlight('plaintext')
      showIssuePromo(origErrorMsg)
      hideCopyToClipboard()
    }
  }
  const generatedCodeEl = document.getElementById('generated-code')
  const warningsEl = document.getElementById('warnings')
  // We need to hide the element that has the padding
  const warningsContainerEl = document.getElementById('warnings-container')
  if (!error) {
    generatedCodeEl.textContent = generatedCode
    changeHighlight(language)
  } else {
    generatedCodeEl.textContent = error
    changeHighlight('plaintext')
  }

  if (userOS === 'windows' && curlCode.split('^', 6).length > 5) {
    warnings.push(['copy-as-cmd', 'Did you press "Copy as cURL (cmd)" instead of "Copy as cURL (bash)"? Only bash commands are supported.'])
  }
  if (warnings && warnings.length) {
    warningsEl.textContent = warnings.map(w => w[1]).join('\n')
    warningsContainerEl.style.display = 'inline-block'
  } else {
    warningsEl.textContent = ''
    warningsContainerEl.style.display = 'none'
  }
}

let startingLanguage = ''
const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '')
const hash = window.location.hash.replace('#', '')
// backwards compatibility in hash
// the language used to be stored in the hash, like http://localhost:8080/#elixir
// now it's stored in the path http://localhost:8080/elixir
if (!path && hash) {
  // backwards compat
  if (hash === 'browser') {
    startingLanguage = 'javascript'
  } else if (hash === 'node') {
    startingLanguage = 'node-fetch'
  } else {
    startingLanguage = hash
  }
} else {
  startingLanguage = path
}
if (Object.prototype.hasOwnProperty.call(languages, startingLanguage)) {
  changeLanguage(startingLanguage)
}

const curlCodeInput = document.getElementById('curl-code')
curlCodeInput.addEventListener('input', convert)

// listen for change in select
const languageSelect = document.getElementById('language-select')
languageSelect.addEventListener('change', function () {
  const language = document.getElementById('language-select').value
  changeLanguage(language)
  convert()
})

const languageNavbar = document.getElementById('language-navbar')
const languageNavbarItems = languageNavbar.querySelectorAll('.nav-link:not(.dropdown-toggle):not(.nav-link-outbound), .dropdown-item')
for (const navbarItem of languageNavbarItems) {
  navbarItem.addEventListener('click', function (e) {
    e.preventDefault()

    const language = new URL(e.target.href).pathname.replace(/^\/+/, '').replace(/\/+$/, '').split('/')[0]

    changeLanguage(language)
    convert()
  })
}

const getExample = document.getElementById('get-example')
getExample.addEventListener('click', function (e) {
  e.preventDefault() // Don't scroll to the top of the page
  showExample(getExampleText)
})

const postExample = document.getElementById('post-example')
postExample.addEventListener('click', function (e) {
  e.preventDefault()
  showExample(postExampleText)
})

const basicAuthExample = document.getElementById('basic-auth-example')
basicAuthExample.addEventListener('click', function (e) {
  e.preventDefault()
  showExample(authExampleText)
})

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
let userOS = 'mac'
try {
  const detectedBrowser = detect()
  if (detectedBrowser && detectedBrowser.name && browsers.includes(detectedBrowser.name)) {
    userBrowser = detectedBrowser.name
    if (detectedBrowser.os && detectedBrowser.os.toLowerCase().includes('windows')) {
      userOS = 'windows'
    }
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

  const screenshot = document.getElementById('screenshot')
  const [width, height] = {
    chrome: [648, 354],
    firefox: [733, 251],
    safari: [658, 373]
  }[browser]
  const newInnerHTML = `
          <source srcset="/images/${browser}.webp, /images/${browser}@2x.webp 2x" type="image/webp">
          <img class="img-fluid mx-auto d-block" src="/images/${browser}.png" srcset="/images/${browser}@2x.png 2x" width="${width}" height="${height}"alt="screenshot of browser DevTools showing how to copy a network request as curl">
        `
  if (screenshot.innerHTML !== newInnerHTML) {
    screenshot.innerHTML = newInnerHTML
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

const inputBox = document.getElementById('curl-code')
const prevCommand = window.sessionStorage.getItem('prev-curl-command')
if (prevCommand) {
  if (!inputBox.value) {
    inputBox.value = prevCommand
  }
}
inputBox.removeAttribute('disabled')
convert()
showInstructions()
