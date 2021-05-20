# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.177.0/containers/debian/.devcontainer/base.Dockerfile

# [Choice] Debian version: buster, stretch
ARG VARIANT="buster"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}
ARG NVM_VERSION="0.38.0"

# Install tools and deps (https://airdcpp-web.github.io/docs/installation/dependencies.html)
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    # Tools
    vim bash-completion build-essential
    
# Install latest node and npm for the vscode user
USER vscode
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash && \
    export NVM_DIR="/home/vscode/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install node && npm install -g npm
