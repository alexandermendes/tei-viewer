# tei-viewer

A single page HTML5 application to display and export TEI records. The viwer aims
to provide a convenient way for researchers to view summaries of multiple TEI
XML documents.


## Usage

[Try it here](http://alexandermendes.github.io/tei-viewer/)

Click the **Add Files** button to upload TEI XML documents and save them to local
storage. The documents are then merged and transformed via XSLT to be displayed
in both table and list formats.

The **Clear** button removes all documents from local storage, the **Export to CSV**
button exports all data currently in the table to a CSV file and the **Print** button
prints, suprisingly.


## Settings

The following settings are provided:

- **Table XSLT / List XSLT:** Specify the XSLT document used to transform and
display your data. Submit a pull request to add additional stylesheets
to this repository.

- **Unique filenames:** Allow more than one file with the same filename to be
uploaded. This setting can only be changed when local storage is empty.


## Running offline

It is possible to run tei-viewer offline, however, your browser will probably
block certain AJAX calls to the local filesystem. There are various ways round
this, depending on your browser, but perhaps one of the simplest is to just run
a local server.

Here's an example of how to run a local instance of tei-viewer using Python 2.x:

```
git clone https://github.com/alexandermendes/tei-viewer
cd tei-viewer
python -m SimpleHTTPServer
```

Then visit [http://localhost:8000/](http://localhost:8000/)
