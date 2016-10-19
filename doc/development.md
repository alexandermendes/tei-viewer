# Development

To create a new transformation just add a new file to the `_posts` folder,
following the format:

{% highlight html %}
<main id="table-view">
    <table class="table table-bordered">
        <thead>
            <tr>
                <th class="bg-faded select-all">Index Column</th>
                <th data-tag="idno">Column Heading</th>
                <!-- ... -->
            </tr>
        </thead>
        <tbody>
            <!-- Table data loaded here -->
        </tbody>
    </table>
</main>
{% endhighlight %}
