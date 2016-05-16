# tei-viewer

A single page HTML5 application to display and export summaries of multiple
TEI XML documents.

Uploaded files are saved to local storage, transformed via XSLT, then displayed
in both list and table formats.

[Try it here](http://alexandermendes.github.io/tei-viewer/)


## Requirements

The application requires a browser that supports HTML5 localStorage, Promises
and the File APIs, for example:

- Chrome 45
- Firefox 45
- Safari 9


## Toolbar

The core functionality is provided via the following toolbar buttons:

- **Add Files:** Upload TEI XML documents.

- **Clear:** Remove all uploaded documents.

- **Print:** Print the current view.

- **Hide:** Hide table columns.

- **Show:** Show table columns.

- **Export to CSV:** Export the table to a CSV file.


## Settings

The following settings are provided:

- **Table XSLT:** The XSLT document used to transform for table display.

- **List XSLT:** The XSLT document used to transform for list display.

- **Unique filenames:** Allow more than one file with the same filename to be
uploaded.

- **Default settings:** Return to default settings.

Note that certain settings can only be changed when no XML files are loaded.


## Running offline

It is possible to run tei-viewer offline, however, your browser will probably
block certain AJAX calls to the local filesystem. There are various ways around
this, depending on your browser, but perhaps one of the simplest is to just run
a local server.

Here's an example of how to run a local instance of tei-viewer using Python 2.x:

```
git clone https://github.com/alexandermendes/tei-viewer
cd tei-viewer
python -m SimpleHTTPServer
```

Then visit [http://localhost:8000/](http://localhost:8000/)


## Contributing

Bugs and improvements are tracked as [issues](https://github.com/alexandermendes/tei-viewer/issues).

If you find that you want to display your TEI data in a particular way feel free to submit
a pull request to add additonal XSLT scripts. Just add the script to the
[xsl](https://github.com/alexandermendes/tei-viewer/tree/master/assets/xsl) directory
and load it via [settings.json](settings.json).