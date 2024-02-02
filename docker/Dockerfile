FROM node:21.6.1 AS build

# Create a directory for the build and populate it with repo
COPY ./ /opt/curl-build/

WORKDIR /opt

# Install the prerequisites for the project
RUN echo "## Update and install packages" && \
    apt-get -qq -y update && \
    apt-get -qq install -y --no-install-recommends \
        binutils \
        build-essential \
        ca-certificates \
        file \
        git \
        python3 \
        python3-pip && \
    echo "## Done"

# Install EMSDK
RUN echo "## Build and install EMSDK" && \
    git clone https://github.com/emscripten-core/emsdk.git && \
    cd emsdk && \
    bash emsdk install latest && \
    bash emsdk activate latest && \
    echo "## Done"

# Build curlconverter.github.io distribution
RUN echo "## Build curlconverter.gitub.io" && \
    cd /opt/emsdk && \
    . /opt/emsdk/emsdk_env.sh && \
    cd /opt/curl-build && \
    npm install && \
    npm run build && \
    echo "## Done"


# Create a new image from the build containing just the web content
FROM nginx:latest
COPY --from=build /opt/curl-build/dist /usr/share/nginx/html


LABEL maintainer="contact@lemonlemmings.co.uk" \
      org.label-schema.name="curlconverter.github.io" \
      org.label-schema.description="A container containing the curlconverter.github.io demonstration web app" \
      org.label-schema.url="https://curlconverter.com" \
      org.label-schema.vcs-url="https://github.com/curlconverter/curlconverter.github.io" \
      org.label-schema.docker.dockerfile="/docker/Dockerfile"
