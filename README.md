# tei-viewer

A single page HTML5 application to display and export summaries of multiple
TEI XML documents.


## Usage

[Try it here](http://alexandermendes.github.io/tei-viewer/)

Click the **Add Files** button to upload TEI XML documents and save them to local
storage. These documents are merged and transformed via XSLT, to be displayed
in both table and list formats.

The **Clear** button removes all uploaded documents, the **Export to CSV**
button exports the table to a CSV file and the **Print** button prints,
suprisingly.


## Settings

The following settings are provided:

- **Table XSLT / List XSLT:** The XSLT documents used to transform and
display your data. Submit a pull request to add additional stylesheets
to this repository.

- **Unique filenames:** Allow more than one file with the same filename to be
uploaded.

- **Default settings:** Result to default settings.

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
