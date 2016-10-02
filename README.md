---
layout: docs
title: Documentation
description: The TEI Viewer documentation.
active: help
permalink: /help
---

# TEI Viewer

[![Build Status](https://travis-ci.org/alexandermendes/tei-viewer.svg?branch=master)](https://travis-ci.org/alexandermendes/tei-viewer)

TEI Viewer is an HTML 5 application for viewing and manipulating TEI XML
documents.

Uploaded documents are stored locally, inside your browser, meaning
that they will remain available between uses of the application (assuming you
don't clear your browser's cache).

Once uploaded, documents are transformed using the XLST script specified in
your settings and displayed in table form.


## Requirements

The application requires a modern browser with HTML5 support, if your browser
does not meet the requirements an error message will be shown when the
application is loaded.


## Table

The toolbar at the top of the table view provides the following options:

- **Add Files:** Upload TEI XML documents.

- **Hide:** Hide table columns.

- **Show:** Show table columns.

- **Clear:** Remove all, or selected rows.

- **Export:** Export the all rows to a CSV file.

- **Print:** Print the current view.

- **Settings:** View and modify the settings.

- **Help:** View the README file.


## XML Editor

Clicking the **<\\>** icon in the index column of a row will take you to a code
editor containing the original XML document. From here you can make changes that
will be reflected in the table view. You can also download your edited copies.


## Settings

A cookie is used to store the following general settings between uses:

- **XSLT:** The XSLT script used to transform uploaded XML documents for table display.

- **Show Tooltips:** Show/hide tooltips.

- **Show Borders:** Show/hide table borders.

- **Freeze Header:** Freeze/unfreeze the header row.

- **Records Per Page:** The maximum number of records to display on each page.

- **Reset Settings:** Return to default settings.


## Contributing

Contributions of all kinds are welcome. To submit a bug report, feature request,
or pull request please create a new [GitHub Issue]({{ site.github.repository_url }}/issues).


## Development

The site is built with Jekyll and served with GitHub Pages.

```
# install npm packages
npm install
# run Grunt tasks
grunt dev
# install bundler
gem install bundler
# install gems
bundle install
# serve
bundle exec jekyll serve
```


## Testing

Tests are run with `grunt test`
