curl https://example.com \
  -d "name=curl" \
  --data @filename \
  --data-binary @binary_file_causes_everything_to_be_bytes \
  --data-urlencode even_urlencoded_stdin@- \
  --json andjson
  