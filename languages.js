import HTTPSnippet from 'httpsnippet'

import * as curlconverter from 'curlconverter'

function httpsnippet(title, lang, client) {
  lang = lang ? lang : title.toLowerCase()
  const to = (curl) => {
    const [har, warnings] = curlconverter.toHarStringWarn(curl)
    const parsedHar = JSON.parse(har)
    const httpSnippet = new HTTPSnippet(parsedHar)
    let code = client ? httpSnippet.convert(lang, client) : httpSnippet.convert(lang)
    warnings.push(['httpsnippet', title + ' code is generated by the httpsnippet library.'])
    if (Array.isArray(code)) {
      code = code.join('\n\n')
    }
    return [code, warnings]
  }
  return { converter: to, hljs: lang, title }
}

export const languages = {
  ansible: { converter: curlconverter.toAnsibleWarn, hljs: 'yaml', title: 'Ansible' },
  // TODO: CFML isn't supported by highlight.js
  cfml: { converter: curlconverter.toCFMLWarn, hljs: 'javascript', title: 'ColdFusion Markup Language' },
  csharp: { converter: curlconverter.toCSharpWarn, hljs: 'csharp', title: 'C# + HttpClient' },
  'csharp-restsharp': httpsnippet('C# + RestSharp', 'csharp', 'restsharp'),
  clojure: httpsnippet('Clojure'),
  dart: { converter: curlconverter.toDartWarn, hljs: 'dart', title: 'Dart' },
  elixir: { converter: curlconverter.toElixirWarn, hljs: 'elixir', title: 'Elixir' },
  go: { converter: curlconverter.toGoWarn, hljs: 'go', title: 'Go' },
  har: { converter: curlconverter.toHarStringWarn, hljs: 'json', title: 'HAR' },
  httpie: httpsnippet('HTTPie', 'shell', 'httpie'),
  java: { converter: curlconverter.toJavaWarn, hljs: 'java', title: 'Java + java.net.http' },
  'java-asynchttp': httpsnippet('Java + AsyncHttpClient', 'java', 'asynchttp'),
  'java-okhttp': httpsnippet('Java + OkHttp', 'java', 'okhttp'),
  'java-unirest': httpsnippet('Java + Unirest', 'java', 'unirest'),
  javascript: { converter: curlconverter.toJavaScriptWarn, hljs: 'javascript', title: 'JavaScript + fetch' },
  'javascript-jquery': httpsnippet('JavaScript + jQuery', 'javascript', 'jquery'),
  'javascript-xhr': httpsnippet('JavaScript + XHR', 'javascript', 'xhr'),
  // People googling for "curl json" are probably looking for something else
  json: { converter: curlconverter.toJsonStringWarn, hljs: 'json', title: 'a JSON object' },
  kotlin: httpsnippet('Kotlin'),
  matlab: { converter: curlconverter.toMATLABWarn, hljs: 'matlab', title: 'MATLAB' },
  'node-fetch': { converter: curlconverter.toNodeWarn, hljs: 'javascript', title: 'node-fetch' },
  'node-axios': { converter: curlconverter.toNodeAxiosWarn, hljs: 'javascript', title: 'Node + Axios' },
  'node-got': { converter: curlconverter.toNodeGotWarn, hljs: 'javascript', title: 'Node + Got' },
  'node-request': { converter: curlconverter.toNodeRequestWarn, hljs: 'javascript', title: 'Node + request' },
  'node-http': httpsnippet('Node + http', 'javascript', 'http'),
  'node-unirest': httpsnippet('Node + unirest', 'javascript', 'unirest'),
  php: { converter: curlconverter.toPhpWarn, hljs: 'php', title: 'PHP' },
  'php-guzzle': httpsnippet('PHP + Guzzle', 'php', 'guzzle'),
  'php-http1': httpsnippet('PHP + HTTP v1', 'php', 'http1'),
  'php-http2': httpsnippet('PHP + HTTP v2', 'php', 'http2'),
  'powershell-restmethod': httpsnippet('PowerShell + Invoke-RestMethod', 'powershell', 'restmethod'),
  'powershell-webrequest': httpsnippet('PowerShell + Invoke-WebRequest', 'powershell', 'webrequest'),
  python: { converter: curlconverter.toPythonWarn, hljs: 'python', title: 'Python' },
  'python-httpclient': httpsnippet('Python + http.client', 'python', 'python3'),
  r: { converter: curlconverter.toRWarn, hljs: 'r', title: 'R' },
  ruby: { converter: curlconverter.toRubyWarn, hljs: 'ruby', title: 'Ruby' },
  rust: { converter: curlconverter.toRustWarn, hljs: 'rust', title: 'Rust' },
  swift: httpsnippet('Swift'),
  wget: httpsnippet('Wget', 'shell', 'wget'),
}