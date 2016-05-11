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
            <p><strong><xsl:value-of select=".//tei:msDesc/tei:msIdentifier/tei:idno"/></strong></p>
            <p><xsl:value-of select=".//tei:msDesc/tei:head"/></p>
            <p><xsl:value-of select=".//tei:objectDesc/tei:supportDesc/tei:extent/text()"/></p>
            <p><xsl:value-of select=".//tei:msDesc/tei:msContents/tei:textLang"/></p>
        </li>
    </xsl:template>

</xsl:stylesheet>
