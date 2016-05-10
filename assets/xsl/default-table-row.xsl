<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
    
    <xsl:template match="/">
        <tr>
            <td data-heading="Shelfmark"><xsl:value-of select="//tei:msDesc/tei:msIdentifier/tei:idno"/></td>
            <td data-heading="Title"><xsl:value-of select="//tei:msDesc/tei:head"/></td>
            <td data-heading="Extent"><xsl:value-of select="//tei:objectDesc/tei:supportDesc/tei:extent/text()"/></td>
            <td data-heading="Language"><xsl:value-of select="//tei:msDesc/tei:msContents/tei:textLang"/></td>
        </tr>
    </xsl:template>

</xsl:stylesheet>

