<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

    <xsl:template match="/">
        <li>
            <p><xsl:value-of select="//tei:msDesc/tei:msIdentifier/tei:idno"/></p>
            <p><xsl:value-of select="//tei:msDesc/tei:head"/></p>
            <p><xsl:value-of select="//tei:objectDesc/tei:supportDesc/tei:extent/text()"/></p>
            <p><xsl:value-of select="//tei:msDesc/tei:msContents/tei:textLang"/></p>
        </li>
    </xsl:template>

</xsl:stylesheet>
