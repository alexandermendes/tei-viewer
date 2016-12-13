---
layout: contained
title: Documentation
active: docs
description: The TEI Viewer documentation.
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

Layouts are stored in the `table` folder, here's an example:

```html
---
layout: table
title: British Library Simplified
permalink: /table/british-library-simplified
---

<th data-tag="idno">Shelfmark</th>
<th data-tag="title">Title</th>
<th data-tag="author">Author</th>
<th data-tag="contentsSummary">Contents</th>
<th data-tag="language">Language</th>
<th data-tag="scribes">Scribe</th>
<th data-tag="physicalDescription">Physical Description</th>
<th data-tag="extent">Extent</th>
<th data-tag="handDesc">Script</th>
<th data-tag="date">Date</th>
<th data-tag="provenance">Provenance</th>
```

Just edit the `title` and `permalink` variables at the top of the page then
specify your required table headings, following the format below:

```html
<th data-tag="tagName" class="optionalClasses">Heading</th>
```

The `data-tag` attribute identifies the location of the data in the XML documents.
The available tags can be seen in `table.xsl` (e.g. `<idno>`, `<title>`, `<author>`).
The following optional classes below can also be added:

#### select-all

Clicking on this header cell will select all rows in the table (usually best
specified at the top of the index column).

#### add-link

Use the contents of this cell along with the `data-link-prefix` and
`data-link-suffix` attributes to construct a link that will open in a seperate
tab, for example:

```html
<th data-tag="idno" class="add-link"
    data-link-prefix="http://www.bl.uk/manuscripts/FullDisplay.aspx?ref=">Shelfmark</th>
```


### Updating the XSLT

To retrieve additional data from the TEI documents not yet available via the
existing `data-tag` options you can edit the `table.xsl` file. The following
example shows how the title is currently retrieved:

```xml
<title>
    <xsl:value-of select="tei:msItem[1]/tei:title" />
</title>
```


### Releases

A new release will be published following any layout or XSLT updates. In the
case of XSLT updates, any stored records will be updated to apply the new
transformation the next time a table view is loaded. In development environments
the records will be updated each time a table view is loaded, which means that
it will take a bit longer to load table views during development.