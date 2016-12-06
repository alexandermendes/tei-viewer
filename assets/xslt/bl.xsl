<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:tei="http://www.tei-c.org/ns/1.0"
		version="1.0">
    <xsl:import href="helpers.xsl" />
    <xsl:output method="text" encoding="UTF-8" media-type="text/plain" />
    <xsl:strip-space elements="*" />

    <!-- Increment this when the transformation is updated -->
    <xsl:variable name="version" select="'1'" />

    <xsl:template match="tei:TEI">
        <xsl:text>{"version": "</xsl:text>
        <xsl:value-of select="$version" />
        <xsl:text>", "data": {</xsl:text>
        <xsl:apply-templates select="tei:teiHeader" />
        <xsl:text>}}</xsl:text>
    </xsl:template>

    <xsl:template match="tei:teiHeader">

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Shelfmark'" />
            <xsl:with-param name="nodeset" select=".//tei:msIdentifier/tei:idno" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Title'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:title" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Authors'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:author/tei:persName" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Contents'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:summary" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Language'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:textLang" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Decorations: Initial Words'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:decoNote[@type='initial']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Decorations: Miniatures'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:decoNote[@type='miniature']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Decorations: Illustrations'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:decoNote[@type='illustration']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Decorations: Paratext'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:decoNote[@type='paratext']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Decorations: Borders'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:decoNote[@type='borders']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Decorations: Other'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:decoNote[@type='other']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Colophon'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:colophon" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Comments'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:note" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Detailed Contents'" />
            <xsl:with-param name="nodeset" select=".//tei:msContents/tei:msItem/tei:msItem" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Scribes'" />
            <xsl:with-param name="nodeset" select=".//*/tei:name[@type='person' and @role='scribe']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Physical Description'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:p" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Material'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:support" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Extent'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:extent" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Collation'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:collation" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Condition'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:condition" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Layout'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:objectDesc/tei:layout" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Script'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:handDesc" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Number of Scribes'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:handDesc/@hands" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Additions'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:additions" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Binding'" />
            <xsl:with-param name="nodeset" select=".//tei:physDesc/tei:bindingDesc" />
        </xsl:call-template>

        <xsl:text>"Date": "</xsl:text>
        <xsl:for-each select=".//tei:history/tei:origin/@*">
            <xsl:value-of select="name(.)" />
            <xsl:text>:</xsl:text>
            <xsl:value-of select="." />
            <xsl:text>\\n</xsl:text>
        </xsl:for-each>
        <xsl:text>" ,</xsl:text>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Provenance'" />
            <xsl:with-param name="nodeset" select=".//tei:history/tei:provenance" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Acquisition'" />
            <xsl:with-param name="nodeset" select=".//tei:history/tei:acquisition" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Related People'" />
            <xsl:with-param name="nodeset" select=".//tei:name[@type='person' and not(@role='scribe') and not(@role='author')]" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Related Places'" />
            <xsl:with-param name="nodeset" select=".//tei:name[@type='place']" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Record History'" />
            <xsl:with-param name="nodeset" select=".//tei:additional/tei:adminInfo/tei:recordHist" />
        </xsl:call-template>

        <xsl:call-template name="tojson">
            <xsl:with-param name="key" select="'Margoliouth ID'" />
            <xsl:with-param name="nodeset" select=".//tei:additional/tei:listBibl/tei:bibl/tei:ref[@target='Margoliouth_1965']" />
            <xsl:with-param name="nocomma" select="true()" />
        </xsl:call-template>

    </xsl:template>

    <!-- Strip unmatched text -->
    <xsl:template match="text()" />

</xsl:stylesheet>