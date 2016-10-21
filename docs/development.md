---
layout: docs
title: Documentation
active: docs
description: The TEI Viewer documentation.
permalink: /docs/development
---

# Development

A development environment can be setup as follows:

```shell
# install npm packages
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

The XML documents are transformed using XSLT then converted into JSON (to
improve performance when building the table). The original XML and the
transformed JSON data are stored using IndexedDB. A seperate HTML page is
created for each table layout, specifying the columns that should be included
and any additional operations that should be performed on those columns
(e.g. adding links).

Pull requests are welcome and the following sections explain how to add a new
layout.


### Adding a layout

Layouts are stored in the [`table`]({{ site.github.repository_url}}/table) folder
and should be created using the following template:

```html
<main id="table-view">
    <table class="table table-bordered" data-xslt="{{ site.main-xslt }}">
        <thead>
            <tr>
                <th class="bg-faded select-all">#</th>
                <!-- Specify additional headers here -->
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</main>
```

The only thing that you should need to edit is the header row, where columns
are specified as follows:

```html
<th data-tag="idno">Shelfmark</th>
```

The `data-tag` attribute identifies the location of the data in the XML documents.
The available tags can be seen in the [`table.xsl`]({{ site.github.repository_url}}{{ site.main-xslt }})
file (e.g. `<idno>`, `<title>`, `<author>`).


#### select-all

Clicking on this header cell will select all rows in the table (usually best
specified at the top of the index column).

#### add-link

Use the contents of this cell along with the `data-link-prefix` and
`data-link-suffix` attributes to construct a link that will open in a seperate
tab, for example:

```html
<th data-tag="idno" class="add-link" data-link-prefix="http://www.bl.uk/manuscripts/FullDisplay.aspx?ref=">Shelfmark</th>
```


### Updating the XSLT

To retrieve additional data from the TEI documents, not yet available via the
existing `data-tag` options, you can edit [`table.xsl`]({{ site.github.repository_url}}{{ site.main-xslt }})
directly. The following example shows how the title is currently retrieved:

```xml
<title>
    <xsl:value-of select="tei:msItem[1]/tei:title" />
</title>
```

Any stored records will be updated to apply the new transformation the next time a table view is refreshed.
