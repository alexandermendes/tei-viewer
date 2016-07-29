<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

        <xsl:template name="recursiveCopy">
                <xsl:param name="root" />
                <xsl:param name="break-lines" />
                <xsl:for-each select="$root">
                    <xsl:for-each select=".">
                        <xsl:element name="{name()}">
                            <xsl:copy-of select="@*|node()" />
                        </xsl:element>
                    </xsl:for-each>
                    <xsl:if test="position() != last() and $break-lines = true()">
                        <xsl:text>; </xsl:text>
                        <br />
                    </xsl:if>
                </xsl:for-each>
        </xsl:template>

</xsl:stylesheet>