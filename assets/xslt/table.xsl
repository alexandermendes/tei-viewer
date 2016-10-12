<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
<xsl:output method="html" />

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

    <xsl:template match="tei:TEI">
        <table>
            <tbody>
                <tr>
                    <td></td> <!-- Index -->
                    <td></td> <!-- Select -->
                    <xsl:apply-templates select=".//tei:msDesc/tei:msIdentifier"/>
                    <xsl:apply-templates select=".//tei:msDesc/tei:msContents"/>
                    <xsl:call-template name="scribes"/>
                    <xsl:apply-templates select=".//tei:msDesc/tei:physDesc"/>
                    <xsl:apply-templates select=".//tei:msDesc/tei:history"/>
                    <xsl:call-template name="people"/>
                    <xsl:call-template name="places"/>
                    <xsl:apply-templates select=".//tei:msDesc/tei:additional"/>
                </tr>
            </tbody>
        </table>
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
        <td>  <!-- 6: Decorations - Initial Words -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:decoNote[@type='initial']" />
            </xsl:call-template>
        </td>
        <td>  <!-- 7: Decorations - Miniatures -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:decoNote[@type='miniature']" />
            </xsl:call-template>
        </td>
        <td>  <!-- 8: Decorations - Illustrations -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:decoNote[@type='illustration']" />
            </xsl:call-template>
        </td>
        <td>  <!-- 9: Decorations - Paratext -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:decoNote[@type='paratext']" />
            </xsl:call-template>
        </td>
        <td>  <!-- 10: Decorations - Borders -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:decoNote[@type='border']" />
            </xsl:call-template>
        </td>
        <td>  <!-- 11: Decorations - Other -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:decoNote[@type='other']" />
            </xsl:call-template>
        </td>
        <td>  <!-- 12: Colophon -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:colophon" />
            </xsl:call-template>
        </td>
        <td>  <!-- 13: Comments -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem[1]/tei:note" />
            </xsl:call-template>
        </td>
        <td>  <!-- 14: Detailed Contents -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:msItem/tei:msItem" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template name="scribes">
        <td>  <!-- 15: Scribes -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select=".//*/tei:name[@type='person' and @role='scribe']" />
                <xsl:with-param name="break-lines" select="true()" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template match="tei:physDesc">
        <td>  <!-- 16: Physical Description -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:p" />
            </xsl:call-template>
        </td>
        <td>  <!-- 17: Material -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:objectDesc/tei:supportDesc/tei:support" />
            </xsl:call-template>
        </td>
        <td>  <!-- 18: Extent -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:objectDesc/tei:supportDesc/tei:extent" />
                <xsl:with-param name="break-lines" select="true()" />
            </xsl:call-template>
        </td>
        <td>  <!-- 19: Collation -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:objectDesc/tei:supportDesc/tei:collation" />
            </xsl:call-template>
        </td>
        <td>  <!-- 20: Condition -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:objectDesc/tei:supportDesc/tei:condition" />
            </xsl:call-template>
        </td>
        <td>  <!-- 21: Layout -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:objectDesc/tei:layoutDesc" />
            </xsl:call-template>
        </td>
        <td>  <!-- 22: Script -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:handDesc" />
            </xsl:call-template>
        </td>
        <td>  <!-- 23: Additions -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:additions" />
            </xsl:call-template>
        </td>
        <td>  <!-- 24: Binding -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:bindingDesc" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template match="tei:history">
        <td>  <!-- 25: Date -->
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
        <td>  <!-- 26: Provenance -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:provenance" />
            </xsl:call-template>
        </td>
        <td>  <!-- 27: Acquisition -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:acquisition" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template name="people">
        <td data-addon="role">  <!-- 28: Related People -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select=".//*/tei:name[@type='person' and not(@role='scribe') and not(@role='author')]" />
                <xsl:with-param name="break-lines" select="true()" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template name="places">
        <td>  <!-- 29: Related Places -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select=".//*/tei:name[@type='place']" />
                <xsl:with-param name="break-lines" select="true()" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template match="tei:additional">
        <td>  <!-- 30: Record History -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:adminInfo/tei:recordHist" />
            </xsl:call-template>
        </td>
        <td>  <!-- 31: Margoliouth ID -->
            <xsl:call-template name="recursiveCopy">
                <xsl:with-param name="root" select="tei:listBibl/tei:bibl/tei:ref[@target='Margoliouth_1965']" />
            </xsl:call-template>
        </td>
    </xsl:template>

</xsl:stylesheet>