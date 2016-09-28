# tei-viewer

An HTML5 application for viewing TEI XML documents in table form.

[Try it here](http://alexandermendes.github.io/tei-viewer/)

The site is built with Jekyll and served with GitHub Pages.

```
# install npm packages
npm install
# run any tasks
grunt
# install bundler
gem install bundler
# install gems
bundle install
# serve
bundle exec jekyll serve
```


## Requirements

The application requires a browser with HTML5 support.


## Toolbar

The core functionality is provided via the following toolbar buttons:

- **Add Files:** Upload TEI XML documents.

- **Hide:** Hide table columns.

- **Show:** Show table columns.

- **Clear:** Remove all, or selected rows.

- **Export:** Export the all rows to a CSV file.

- **Print:** Print the current view.

- **Settings:** View and modify the settings.

- **Help:** View the README file.


## Settings

A cookie is used to store the following general settings between uses:

- **XSLT:** The XSLT script used to transform uploaded XML documents for table display.

- **Show Tooltips:** Show/hide tooltips.

- **Show Borders:** Show/hide table borders.

- **Freeze Header:** Freeze/unfreeze the header row.

- **Records Per Page:** The maximum number of records to display on each page.

- **Reset Settings:** Return to default settings.


## XML Editor

Clicking the **<\\>** icon in the index column of each row will take you to a code
editor containing the original XML document. From here you can make changes that
will be reflected in the table and download the edited copies.


## Contributing

Bugs and suggested improvements are tracked as
[GitHub Issues](https://github.com/alexandermendes/tei-viewer/issues).
