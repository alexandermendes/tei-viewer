#!/usr/bin/env bash

sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential git

# Install RVM.
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
\curl -sSL https://get.rvm.io | bash -s stable --ruby
source ~/.rvm/scripts/rvm

# Install Node.js
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs

# Install bundler.
gem install bundler

# Install gems
cd /vagrant
bundle install

# Install Grunt CLI
# npm install -g grunt-cli

# Run dev tasks
# grunt dev

# Serve
# bundle exec jekyll serve --detach --host=0.0.0.0