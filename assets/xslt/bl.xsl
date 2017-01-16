<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:tei="http://www.tei-c.org/ns/1.0"
		exclude-result-prefixes="tei">
    <xsl:output method="xml" encoding="UTF-8" media-type="application/xml" indent="yes" />
    <xsl:strip-space elements="*" />

    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="shelfmark" select="*//tei:msIdentifier/tei:idno" />

    <xsl:template match="tei:TEI">
        <TEI>
	    <xsl:apply-templates/>
	</TEI>
    </xsl:template>

    <xsl:template match="tei:teiHeader">

	<Shelfmark>
	    <xsl:call-template name="addDigitisedManuscriptsLink">
		<xsl:with-param name="path" select="'FullDisplay.aspx'" />
		<xsl:with-param name="linkText" select="$shelfmark" />
	    </xsl:call-template>
	</Shelfmark>

	 <xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:title" />
	    <xsl:with-param name="tag" select="'Title'" />
	</xsl:call-template>

	 <xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:author/tei:persName" />
	    <xsl:with-param name="tag" select="'Authors'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:summary" />
	    <xsl:with-param name="tag" select="'Contents'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:textLang" />
	    <xsl:with-param name="tag" select="'Language'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:decoNote[@type='initial']" />
	    <xsl:with-param name="tag" select="'Decorations-InitialWords'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:decoNote[@type='miniature']" />
	    <xsl:with-param name="tag" select="'Decorations-Miniatures'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:decoNote[@type='illustration']" />
	    <xsl:with-param name="tag" select="'Decorations-Illustrations'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:decoNote[@type='paratext']" />
	    <xsl:with-param name="tag" select="'Decorations-Paratext'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:decoNote[@type='borders']" />
	    <xsl:with-param name="tag" select="'Decorations-Borders'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:decoNote[@type='other']" />
	    <xsl:with-param name="tag" select="'Decorations-Other'" />
	</xsl:call-template>'

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:colophon" />
	    <xsl:with-param name="tag" select="'Colophon'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem[1]/tei:note" />
	    <xsl:with-param name="tag" select="'Comments'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:msContents/tei:msItem/tei:msItem" />
	    <xsl:with-param name="tag" select="'DetailedContents'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//*/tei:name[@type='person' and @role='scribe']" />
	    <xsl:with-param name="tag" select="'Scribes'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:p" />
	    <xsl:with-param name="tag" select="'PhysicalDescription'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:support" />
	    <xsl:with-param name="tag" select="'Material'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:extent" />
	    <xsl:with-param name="tag" select="'Extent'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:collation" />
	    <xsl:with-param name="tag" select="'Collation'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:objectDesc/tei:supportDesc/tei:condition" />
	    <xsl:with-param name="tag" select="'Condition'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:objectDesc/tei:layout" />
	    <xsl:with-param name="tag" select="'Layout'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:handDesc" />
	    <xsl:with-param name="tag" select="'Script'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:handDesc/@hands" />
	    <xsl:with-param name="tag" select="'NumberOfScribes'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:additions" />
	    <xsl:with-param name="tag" select="'Additions'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:physDesc/tei:bindingDesc" />
	    <xsl:with-param name="tag" select="'Binding'" />
	</xsl:call-template>

        <Date>
	    <xsl:choose>
                <xsl:when test="tei:origin/@notBefore">
                    <xsl:value-of select="concat(tei:origin/@notBefore, '-', tei:origin/@notAfter)"/>
                </xsl:when>
                <xsl:when test="tei:origin/@notAfter">
                    <xsl:value-of select="tei:origin/@notAfter"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="tei:origin/@when"/>
                </xsl:otherwise>
            </xsl:choose>
        </Date>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:history/tei:provenance" />
	    <xsl:with-param name="tag" select="'Provenance'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:history/tei:acquisition" />
	    <xsl:with-param name="tag" select="'Acquisition'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:name[@type='person' and not(@role='scribe') and not(@role='author')]" />
	    <xsl:with-param name="tag" select="'RelatedPeople'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:name[@type='place']" />
	    <xsl:with-param name="tag" select="'RelatedPlaces'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:additional/tei:adminInfo/tei:recordHist" />
	    <xsl:with-param name="tag" select="'RecordHistory'" />
	</xsl:call-template>

	<xsl:call-template name="addElement">
	    <xsl:with-param name="xpath" select=".//tei:additional/tei:listBibl/tei:bibl" />
	    <xsl:with-param name="tag" select="'Citations'" />
	</xsl:call-template>

    </xsl:template>

    <!-- Append roles -->
    <xsl:template match="*[@role]">
	<xsl:value-of select="."/>
	<xsl:text> (</xsl:text>
	<xsl:value-of select="@role"/>
	<xsl:text>)</xsl:text>
    </xsl:template>

    <!-- Append non-http targets -->
    <xsl:template match="*//tei:ref[not(starts-with(@target, 'http'))]">
	<xsl:value-of select="."/>
	<xsl:text> (</xsl:text>
	<xsl:value-of select="@target"/>
	<xsl:text>)</xsl:text>
    </xsl:template>

    <!-- Append calendar -->
    <xsl:template match="*//date/@calendar">
	<xsl:value-of select="."/>
	<xsl:text> (</xsl:text>
	<xsl:value-of select="@calendar"/>
	<xsl:text>)</xsl:text>
    </xsl:template>

    <!-- Handle <dimensions> -->
    <xsl:template match="*//tei:dimensions">
	<xsl:text>&lt;span class="hidden-xs-up"&gt;; &lt;/span&gt;</xsl:text>
	<xsl:text>&lt;br&gt;&lt;br&gt;</xsl:text>
	<xsl:value-of select="concat(./tei:height, @unit, ' x ', ./tei:width, @unit, ' ', @type)" />
    </xsl:template>

    <!-- Add an HTML link to tags with @target and @key attributes starting with http -->
    <xsl:template match="*[starts-with(@target, 'http')]|*[starts-with(@key, 'http')]">
	<xsl:call-template name="addLink">
	    <xsl:with-param name="url" select="@target|@key" />
	    <xsl:with-param name="text" select="." />
	</xsl:call-template>
    </xsl:template>

    <!-- Add an HTML link -->
    <xsl:template name="addLink">
        <xsl:param name="url" />
        <xsl:param name="text" />
        <xsl:text>&lt;a href="</xsl:text>
	<xsl:value-of select="$url"/>
	<xsl:text>" target="_blank"&gt;</xsl:text>
	<xsl:value-of select="$text"/>
	<xsl:text>&lt;/a&gt;</xsl:text>
    </xsl:template>

    <!-- Seperate each matched element with an HTML line break -->
    <xsl:template name="addElement">
	<xsl:param name="xpath" />
        <xsl:param name="tag" />
	<xsl:element name="{$tag}">
	    <xsl:for-each select="$xpath">
		<xsl:apply-templates select="." />
		<xsl:if test="position() != last()">
		    <xsl:text>&lt;span class="hidden-xs-up"&gt;; &lt;/span&gt;</xsl:text>
		    <xsl:text>&lt;br&gt;&lt;br&gt;</xsl:text>
		</xsl:if>
	    </xsl:for-each>
	</xsl:element>
    </xsl:template>

    <!-- Format <locus> -->
    <xsl:template match="tei:locus">
	<xsl:choose>
	    <xsl:when test="@from and @to">
		<xsl:call-template name="addDigitisedManuscriptsLink">
		    <xsl:with-param name="path" select="'Viewer.aspx'" />
		    <xsl:with-param name="locus" select="@from" />
		    <xsl:with-param name="linkText" select="concat(' ', @from, ' ')" />
		</xsl:call-template>
		<xsl:text>-</xsl:text>
		<xsl:call-template name="addDigitisedManuscriptsLink">
		    <xsl:with-param name="path" select="'Viewer.aspx'" />
		    <xsl:with-param name="locus" select="@to" />
		    <xsl:with-param name="linkText" select="concat(' ', @to, ' ')" />
		</xsl:call-template>
	    </xsl:when>
	    <xsl:when test="@from">
		<xsl:call-template name="addDigitisedManuscriptsLink">
		    <xsl:with-param name="path" select="'Viewer.aspx'" />
		    <xsl:with-param name="locus" select="@from" />
		    <xsl:with-param name="linkText" select="concat(' ', @from, ' ')" />
		</xsl:call-template>
	    </xsl:when>
	    <xsl:when test="@to">
		<xsl:call-template name="addDigitisedManuscriptsLink">
		    <xsl:with-param name="path" select="'Viewer.aspx'" />
		    <xsl:with-param name="locus" select="@to" />
		    <xsl:with-param name="linkText" select="concat(' ', @to, ' ')" />
		</xsl:call-template>
	    </xsl:when>
	    <xsl:otherwise>
		<xsl:call-template name="addDigitisedManuscriptsLink">
		    <xsl:with-param name="path" select="'Viewer.aspx'" />
		    <xsl:with-param name="locus" select="@n" />
		    <xsl:with-param name="linkText" select="concat(' ', @n, ' ')" />
		</xsl:call-template>
	    </xsl:otherwise>
	</xsl:choose>
    </xsl:template>

    <!-- Add an HTML link to a Digitised Manuscripts page -->
    <xsl:template name="addDigitisedManuscriptsLink">
	<xsl:param name="path"/>
	<xsl:param name="locus"/>
	<xsl:param name="linkText"/>
	<xsl:variable name="ref" select="translate(translate($shelfmark, $uppercase, $lowercase), ' ', '_')" />
	<xsl:variable name="baseURL" select="concat('http://www.bl.uk/manuscripts/', $path, '?ref=', $ref)" />
	<xsl:choose>
	    <xsl:when test="$locus and contains('0123456789', substring($locus,1,1))">
		<xsl:variable name="paddedLocus" select="substring(concat('0000', $locus), string-length($locus) + 1, 4)" />
		<xsl:call-template name="addLink">
		    <xsl:with-param name="url" select="concat($baseURL, '_f', $paddedLocus)" />
		    <xsl:with-param name="text" select="$linkText" />
		</xsl:call-template>
	    </xsl:when>
	    <xsl:when test="$locus">
		<xsl:call-template name="addLink">
		    <xsl:with-param name="url" select="concat($baseURL, '_', $locus)" />
		    <xsl:with-param name="text" select="$linkText" />
		</xsl:call-template>
	    </xsl:when>
	    <xsl:otherwise>
		<xsl:call-template name="addLink">
		    <xsl:with-param name="url" select="$baseURL" />
		    <xsl:with-param name="text" select="$linkText" />
		</xsl:call-template>
	    </xsl:otherwise>
	</xsl:choose>
    </xsl:template>

</xsl:stylesheet>