<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <!-- Convert a nodeset to a JSON key-value pair -->
    <xsl:template name="tojson">
        <xsl:param name="key" />
        <xsl:param name="nodeset" />
        <xsl:param name="nocomma" />
        <xsl:text>"</xsl:text>
        <xsl:value-of select="$key" />
        <xsl:text>": "</xsl:text>
        <xsl:for-each select="$nodeset">
            <xsl:call-template name="escapeQuote">
                <xsl:with-param name="pText">
                    <xsl:call-template name="jsonescape">
                        <xsl:with-param name="str" select="normalize-space(.)" />
                    </xsl:call-template>
                </xsl:with-param>
            </xsl:call-template>
            <xsl:if test="position() != last()">
                <xsl:text>&lt;br&gt;&lt;br&gt;</xsl:text>
            </xsl:if>
        </xsl:for-each>
        <xsl:text>"</xsl:text>
        <xsl:if test="not($nocomma)">
            <xsl:text>,</xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template name="escapeQuote">
        <xsl:param name="pText" select="concat(normalize-space(.), '')" />
        <xsl:if test="string-length($pText) &gt;0">
            <xsl:value-of select="substring-before(concat($pText, '&amp;quot;'), '&amp;quot;')" />
            <xsl:if test="contains($pText, '&amp;quot;')">
                <xsl:text>\"</xsl:text>
                <xsl:call-template name="escapeQuote">
                    <xsl:with-param name="pText" select="substring-after($pText, '&amp;quot;')" />
                </xsl:call-template>
            </xsl:if>
        </xsl:if>
    </xsl:template>

    <xsl:template name="jsonescape">
        <xsl:param name="str" select="." />
        <xsl:choose>
            <xsl:when test="contains($str, '\')">
                <xsl:value-of select="concat(substring-before($str, '\'), '\\' )" />
                <xsl:call-template name="jsonescape">
                    <xsl:with-param name="str" select="substring-after($str, '\')" />
                </xsl:call-template>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$str" />
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

</xsl:stylesheet>