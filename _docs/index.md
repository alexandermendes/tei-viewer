---
layout: contained
title: Documentation
active: docs
description: The TEI Viewer documentation.
---

# Getting started

TEI Viewer provides a way to view collections of TEI XML documents in table form,
making it easier to identify key information or locate errors across thousands of
files.


## Uploading

To upload your TEI XML files click the **Upload** button to the right of the
navigation bar, select your files then click **Upload Files**. The files are
stored locally (using [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API))
and will persist between uses of the application, unless you clear your browser's cache.


## Manipulating

Each table provides some basic spreadsheet-style functions, such as sorting, reordering
hiding and showing columns, as well as functions to search and export your data in Excel,
CSV, JSON and JSONP formats.


## Sharing

Data exported in JSONP format can be subsequently loaded into the table by passing
the location of the external file to the `dataset` URL parameter. This means that you
can easily share tables with other users.

Here's a full example using Dropbox:

1. Upload your TEI records and navigate to the relevant table.
2. Export your data in JSONP format.
3. Upload the exported `data.json` file to Dropbox.
4. In Dropbox, create a [shared URL](https://www.dropbox.com/en/help/167) for the file.
5. Replace `dl=0` with `dl=1` at the end of this shared URL.
6. Send the URL to TEI Viewer using the `dataset` parameter.

```
{{ site.baseurl }}/{path-to-table}?dataset={dataset-url}
```

So, you could now embed a table of TEI metadata into your own website like this:

```html
<iframe src="{{ site.baseurl }}/{path-to-table}?dataset={dataset-ur}"
        style="height: 400px; width: 100%;">
</iframe>
```


# Development

TEI Viewer is open source and all contributions are welcome, the source code is
available on [GitHub]({{ site.github.repository_url }}).


## Setup

Ensure that [Ruby](https://www.ruby-lang.org/en/downloads/) >= 2.1.0 and [Node.js](https://nodejs.org/)
are installed, then:

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
are stored in the `_tables` folder and specify an `.xsl` file and the column headings
to be included.
