<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
<xsl:output method="html" />

    <xsl:template match="MERGED-TEI">
        <div class="table-scroll">
            <table class="table table-condensed table-responsive">
                <thead>
                    <tr>
                        <td>Shelfmark</td>
                        <td>Title</td>
                        <td>Extent</td>
                        <td>Language</td>
                    </tr>
                </thead>
                <tbody>
                    <xsl:apply-templates>
                        <xsl:sort select=".//tei:msDesc/tei:msIdentifier/tei:idno"/>
                    </xsl:apply-templates>
                </tbody>
            </table>
        </div>
    </xsl:template>

    <xsl:template match="tei:TEI">
        <tr>
            <td><xsl:value-of select=".//tei:msDesc/tei:msIdentifier/tei:idno"/></td>
            <td><xsl:value-of select=".//tei:msDesc/tei:head"/></td>
            <td><xsl:value-of select=".//tei:objectDesc/tei:supportDesc/tei:extent/text()"/></td>
            <td><xsl:value-of select=".//tei:msDesc/tei:msContents/tei:textLang"/></td>
        </tr>
    </xsl:template>

</xsl:stylesheet>
