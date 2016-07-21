<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

        <xsl:template name="multiValue">
                <xsl:param name="values" />
                <xsl:param name="include-role" />
                <xsl:for-each select="$values">
                    <xsl:if test="string-length(.) &gt; 0">
                        <xsl:value-of select="normalize-space(.)" />
                        <xsl:if test="$include-role = true() and @role">
                            <xsl:value-of select="concat(' (', @role, ')')" />
                        </xsl:if>
                        <xsl:if test="position() != last()">
                            <xsl:text>; </xsl:text>
                            <br />
                        </xsl:if>
                    </xsl:if>
                </xsl:for-each>
        </xsl:template>

        <xsl:template name="recursiveCopy">
                <xsl:param name="root"/>
                <xsl:for-each select="$root">
                    <xsl:for-each select=".">
                        <xsl:element name="{name()}">
                            <xsl:copy-of select="@*|node()" />
                        </xsl:element>
                    </xsl:for-each>
                </xsl:for-each>
        </xsl:template>

</xsl:stylesheet>