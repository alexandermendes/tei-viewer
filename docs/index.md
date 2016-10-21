---
layout: docs
title: Documentation
active: docs
description: The TEI Viewer documentation.
permalink: /docs
---

# Development

To create a new transformation just add a new file to the `_posts` folder,
following the format:

```html
<main id="table-view">
    <table class="table table-bordered">
        <thead>
            <tr>
                <th class="bg-faded select-all">#</th>
                <th data-tag="idno">Identifier</th>
                <th data-tag="title">Title</th>
                <th data-tag="author">Author</th>
                <!-- ... -->
            </tr>
        </thead>
        <tbody>
            <!-- Table data loaded here -->
        </tbody>
    </table>
</main>
```
