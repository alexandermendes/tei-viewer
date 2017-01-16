---
layout: contained
title: Documentation
active: docs
description: The TEI Viewer documentation.
---

# Getting started

TEI Viewer provides a way to view collections of TEI XML documents in table form,
potentially making it easier to identify key information or locate errors across
thousands of individual files. Data can be exported in various formats


## Uploading data

To upload your TEI XML files click the **Upload** button to the right of the
navigation bar, select your files then click **Upload Files**. The files are
actually stored locally (using [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API))
so will persist between uses of the application, unless you clear your browser's cache.


## Manipulating data

Each table provides some basic spreadsheet-style functions, such as sorting, reordering
hiding and showing columns. There are also functions to search and export your data
in Excel, CSV, JSON and JSONP formats.


## Sharing data

Data exported in JSONP format can be subsequently loaded into the table by passing
the location of the file to the `dataset` URL parameter. This means that you can easily
share tables without each user needing to go through the upload process themselves.

Here's a full example using Dropbox:

1. Upload your records then open the relevant table.
2. Export your data in JSONP format.
3. Upload the exported `.json` file to Dropbox.
4. Create and copy the [shared link](https://www.dropbox.com/en/help/167) for the file.
5. Replace `dl=0` with `dl=1` at the end of the copied URL.
6. Send this URL to TEI Viewer using the `dataset` parameter.

```http
{{ site.baseurl }}/\{your-table\}?dataset={dropbox-url}
```


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
