---
layout: docs
title: Development
---

# Development

TEI Viewer is open source and all contributions are welcome, the source code is
available on [GitHub]({{ site.github_url }}).


## Setup

A development environment can be setup as follows (requires [Node.js](https://nodejs.org/)):

```shell
# install packages
npm install
# install bundler
gem install bundler
# install gems
bundle install
# run development tasks
grunt dev
# serve
bundle exec jekyll serve
```


## Transformations

XML documents are transformed to a flat hierarchical structure using XSLT then
converted into JSON (to improve performance when building the table). The original
XML and the transformed JSON data are stored using IndexedDB. HTML table layouts
are stored in the `_tables` folder and specify the associated `.xsl` file and
the tag names to be included.
