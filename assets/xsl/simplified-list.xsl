<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
<xsl:output method="html" />

    <xsl:template match="MERGED-TEI">
        <ol>
            <xsl:apply-templates>
                <xsl:sort select=".//tei:msDesc/tei:msIdentifier/tei:idno"/>
            </xsl:apply-templates>
        </ol>
    </xsl:template>

    <xsl:template match="tei:TEI">
        <li>
            <xsl:apply-templates select=".//tei:msDesc/tei:msIdentifier"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:msContents"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:physDesc"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:history"/>
        </li>
        <br />
    </xsl:template>

    <xsl:template match="tei:msIdentifier">
        <h5 style="margin-bottom:0px;"><a href="https://www.bl.uk/manuscripts/FullDisplay.aspx?ref={translate(tei:idno, ' ', '_')}" target="_blank">
                <xsl:value-of select='tei:idno'/>
            </a>
        </h5>
    </xsl:template>

    <xsl:template match="tei:msContents">
            <xsl:for-each select="tei:msItem[1]/tei:title">
                <xsl:value-of select="."/>
                <xsl:if test="position() != last()">
                    <xsl:text>, </xsl:text>
                </xsl:if>
            </xsl:for-each>
            <br />
            <xsl:value-of select="tei:summary"/><br />
            <xsl:value-of select="tei:textLang"/><br />
    </xsl:template>

    <xsl:template match="tei:physDesc">
        <xsl:value-of select="tei:objectDesc/tei:supportDesc/tei:extent/text()"/><br />
        <xsl:for-each select="tei:objectDesc/tei:supportDesc/tei:extent/tei:dimensions">
        <xsl:value-of select="concat(tei:height, @unit, ' x ', tei:width, @unit)"/>
        <xsl:value-of select="concat(' (', @type, ')')"/>
            <xsl:if test="position() != last()">
                <xsl:text>, </xsl:text>
            </xsl:if>
        </xsl:for-each>
        <br />
    </xsl:template>

    <xsl:template match="tei:history">
        <xsl:if test="tei:provenance">
            <xsl:value-of select="concat(normalize-space(tei:provenance), ', ')"/>
        </xsl:if>
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
    </xsl:template>

</xsl:stylesheet>