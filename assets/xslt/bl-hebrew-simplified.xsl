<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
<xsl:import href="assets/xslt/helpers.xsl" />
<xsl:output method="html" />

    <xsl:template match="MERGED-TEI">
        <table class="table">
            <thead>
                <tr>
                    <th>Shelfmark</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Contents</th>
                    <th>Language</th>
                    <th>Scribe</th>
                    <th>Physical Description</th>
                    <th>Extent</th>
                    <th>Script</th>
                    <th>Date</th>
                    <th>Provenance</th>
                </tr>
            </thead>
            <tbody>
                <xsl:apply-templates select="tei:TEI" />
            </tbody>
        </table>

        <script type="text/javascript">
            <xsl:text>
                $.getScript( "assets/js/bl.js" );
            </xsl:text>
        </script>
    </xsl:template>

    <xsl:template match="tei:TEI">
        <tr>
            <xsl:attribute name="id">
                <xsl:value-of select=".//@id" />
            </xsl:attribute>
            <xsl:apply-templates select=".//tei:msDesc/tei:msIdentifier"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:msContents"/>
            <xsl:call-template name="scribes"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:physDesc"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:history"/>
        </tr>
    </xsl:template>

    <xsl:template match="tei:msIdentifier">
        <td class="shelfmark"> <!-- 1: Shelfmark -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:idno" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template match="tei:msContents">
        <td>  <!-- 2: Title -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:title" />
                <xsl:with-param name="break-lines" select="true()" />
            </xsl:call-template>
        </td>
        <td>  <!-- 3: Authors -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:author/tei:persName" />
                <xsl:with-param name="break-lines" select="true()" />
            </xsl:call-template>
        </td>
        <td>  <!-- 4: Contents -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:summary" />
            </xsl:call-template>
        </td>
        <td>  <!-- 5: Language -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:textLang" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template name="scribes">
        <td>  <!-- 6: Scribes -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select=".//*/tei:name[@type='person' and @role='scribe']" />
                <xsl:with-param name="break-lines" select="true()" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template match="tei:physDesc">
        <td>  <!-- 7: Physical Description -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:p" />
            </xsl:call-template>
        </td>
        <td>  <!-- 8: Extent -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:objectDesc/tei:supportDesc/tei:extent" />
            </xsl:call-template>
        </td>
        <td>  <!-- 9: Script -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:handDesc" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template match="tei:history">
        <td>  <!-- 10: Date -->
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
        <td>  <!-- 11: Provenance -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:provenance" />
            </xsl:call-template>
        </td>
    </xsl:template>

</xsl:stylesheet>