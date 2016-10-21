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

Layouts are stored in the `table` folder and should be created using the
following template:

```html
<main id="table-view">
    <table class="table table-bordered">
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

The `data-tag` attribute identifies the location of the data in the XML document
and can be one of the following

**ADD TABLE**

The following classes can also be added to each header cell.

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

To transform ... edit `table.xsl` then update the version attribute of Transformer in `transformer.js`.


###
