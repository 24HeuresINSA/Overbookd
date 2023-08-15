# Note: You can use any Debian/Ubuntu based image you want.
FROM mcr.microsoft.com/devcontainers/base:bullseye

# Fix bash completion
ADD --chown=root:root --chmod=644 https://sources.debian.org/data/main/b/bash-completion/1%3A2.11-2/bash_completion /usr/share/bash-completion/

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  python3-pip \
  vim
