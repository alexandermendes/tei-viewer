<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
<xsl:output method="html" />

    <xsl:template match="MERGED-TEI">
        <table class="table table-responsive" style="width:250%; max-width:250%;">
            <thead>
                <tr>
                    <th>Shelfmark</th>
                    <th>Title</th>
                    <th>Contents</th>
                    <th>Language</th>
                    <th>Extent</th>
                    <th>Dimensions</th>
                    <th>Date</th>
                    <th>Provenance</th>
                    <th>Acqusition</th>
                    <th>Related People</th>
                    <th>Related Places</th>
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
            <xsl:apply-templates select=".//tei:msDesc/tei:physDesc"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:history"/>

            <td>  <!-- Related people -->
                <xsl:for-each select=".//*/tei:name[@type='person']">
                    <xsl:value-of select="normalize-space(.)"/>
                    <xsl:if test="@role">
                        <xsl:value-of select="concat(' (', @role, ')')"/>
                    </xsl:if>
                    <xsl:if test="position() != last()">
                        <xsl:text>, </xsl:text>
                        <br />
                    </xsl:if>
                </xsl:for-each>
            </td>

            <td>  <!-- Related places -->
                <xsl:for-each select=".//*/tei:name[@type='place']">
                    <xsl:value-of select="normalize-space(.)"/>
                    <xsl:if test="position() != last()">
                        <xsl:text>, </xsl:text>
                        <br />
                    </xsl:if>
                </xsl:for-each>
            </td>
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
            <xsl:for-each select="tei:msItem[1]/tei:title">
                <xsl:value-of select="."/>
                <xsl:if test="position() != last()">
                    <xsl:text>, </xsl:text>
                </xsl:if>
            </xsl:for-each>
        </td>
        <td width="300px"><xsl:value-of select="tei:summary"/></td>  <!-- Contents -->
        <td><xsl:value-of select="tei:textLang"/></td>  <!-- Language -->
    </xsl:template>

    <xsl:template match="tei:physDesc">
        <td>  <!-- Extent -->
            <xsl:value-of select="tei:objectDesc/tei:supportDesc/tei:extent/text()"/>
        </td>
        <td>  <!-- Dimensions -->
            <xsl:for-each select="tei:objectDesc/tei:supportDesc/tei:extent/tei:dimensions">
            <xsl:value-of select="concat(tei:height, @unit, ' x ', tei:width, @unit)"/>
            <xsl:if test="@type">
                <xsl:value-of select="concat(' (', @type, ')')"/>
            </xsl:if>
                <xsl:if test="position() != last()">
                    <xsl:text>, </xsl:text>
                    <br />
                </xsl:if>
            </xsl:for-each>
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
        <td width="500px"><xsl:value-of select="tei:acquisition"/></td>  <!-- Acquisition -->
    </xsl:template>

</xsl:stylesheet>