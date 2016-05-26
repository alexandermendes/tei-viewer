<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
<xsl:output method="html" />

    <xsl:template name="commaSeperate">
        <xsl:param name="values"/>
        <xsl:for-each select="$values">
            <xsl:if test="string-length(.) &gt; 0">
                <xsl:value-of select="normalize-space(.)"/>
                <xsl:if test="position() != last()">
                    <xsl:text>, </xsl:text>
                    <br />
                </xsl:if>
            </xsl:if>
        </xsl:for-each>
    </xsl:template>

    <xsl:template match="MERGED-TEI">
        <table class="table" style="width:250%; max-width:250%;">
            <thead>
                <tr>
                    <th>Shelfmark</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Contents</th>
                    <th>Language</th>
                    <th>Scribe</th>
                    <th>Physical Description</th>
                    <th>Description of Hands</th>
                    <th>Extent</th>
                    <th>Date</th>
                    <th>Provenance</th>
                    <th>Decorations - Initial Words</th>
                    <th>Decorations - Minitures</th>
                    <th>Decorations - Illustrations</th>
                    <th>Decorations - Paratext</th>
                    <th>Decorations - Borders</th>
                    <th>Decorations - Other</th>
                    <th>Colphon</th>
                    <th>Comments</th>
                    <th>Detailed Comments</th>
                    <th>Material</th>
                    <th>Collation</th>
                    <th>Condition</th>
                    <th>Layout</th>
                    <th>Script</th>
                    <th>Additions</th>
                    <th>Binding</th>
                    <th>Record History</th>
                    <th>Margoliouth ID</th>
                </tr>
            </thead>
            <tbody>
                <xsl:apply-templates select="tei:TEI">
                    <xsl:sort select=".//tei:msDesc/tei:msIdentifier/tei:idno"/>
                </xsl:apply-templates>
            </tbody>
        </table>
    </xsl:template>

    <xsl:template match="tei:TEI">
        <tr>
            <xsl:apply-templates select=".//tei:msDesc/tei:msIdentifier"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:msContents"/>
            <xsl:call-template name="scribes"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:physDesc"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:history"/>
        </tr>
    </xsl:template>

    <xsl:template match="tei:msIdentifier">
        <td style="white-space:nowrap;">  <!-- Shelfmark -->
            <a href="https://www.bl.uk/manuscripts/FullDisplay.aspx?ref={translate(tei:idno, ' ', '_')}" target="_blank">
                <xsl:value-of select='tei:idno'/>
            </a>
        </td>
    </xsl:template>

    <xsl:template match="tei:msContents">
        <td width="300px">  <!-- Title -->
            <xsl:call-template name="commaSeperate">
                <xsl:with-param name="values" select="tei:msItem[1]/tei:title" />
            </xsl:call-template>
        </td>
        <td>  <!-- Authors -->
            <xsl:call-template name="commaSeperate">
                <xsl:with-param name="values" select="tei:msItem[1]/tei:author/tei:persName" />
            </xsl:call-template>
        </td>
        <td width="300px"><xsl:value-of select="tei:summary"/></td>  <!-- Contents -->
        <td><xsl:value-of select="tei:textLang"/></td>  <!-- Language -->
    </xsl:template>

    <xsl:template name="scribes">
        <td>  <!-- Scribes -->
            <xsl:call-template name="commaSeperate">
                <xsl:with-param name="values" select=".//*/tei:name[@type='person' and @role='scribe']" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template match="tei:physDesc">
        <td>  <!-- Physical Description -->
            <xsl:value-of select="tei:p"/>
        </td>
        <td>  <!-- Description of Hands -->
            <xsl:value-of select="tei:handDesc"/>
        </td>
        <td>  <!-- Extent -->
            <xsl:value-of select="tei:objectDesc/tei:supportDesc/tei:extent/text()"/>
        </td>
    </xsl:template>

    <xsl:template match="tei:history">
        <td>  <!-- Date -->
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
        </td>
        <td><xsl:value-of select="tei:provenance"/></td>  <!-- Provenance -->
    </xsl:template>

</xsl:stylesheet>