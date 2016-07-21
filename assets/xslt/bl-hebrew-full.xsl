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
                    <th>Decorations - Initial Words</th>
                    <th>Decorations - Miniatures</th>
                    <th>Decorations - Illustrations</th>
                    <th>Decorations - Paratext</th>
                    <th>Decorations - Borders</th>
                    <th>Decorations - Other</th>
                    <th>Colophon</th>
                    <th>Comments</th>
                    <th>Detailed Contents</th>
                    <th>Scribes</th>
                    <th>Physical Description</th>
                    <th>Material</th>
                    <th>Extent</th>
                    <th>Collation</th>
                    <th>Condition</th>
                    <th>Layout</th>
                    <th>Script</th>
                    <th>Additions</th>
                    <th>Binding</th>
                    <th>Date</th>
                    <th>Provenance</th>
                    <th>Acquisition</th>
                    <th>Related People</th>
                    <th>Related Places</th>
                    <th>Record History</th>
                    <th>Margoliouth ID</th>
                </tr>
            </thead>
            <tbody>
                <xsl:apply-templates select="tei:TEI">
                    <xsl:sort select=".//tei:msDesc/tei:msIdentifier/tei:idno"/>
                </xsl:apply-templates>
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
            <xsl:apply-templates select=".//tei:msDesc/tei:msIdentifier"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:msContents"/>
            <xsl:call-template name="scribes"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:physDesc"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:history"/>
            <xsl:call-template name="people"/>
            <xsl:call-template name="places"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:additional"/>
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
            <xsl:call-template name="multiValue">
                <xsl:with-param name="values" select="tei:msItem[1]/tei:title" />
            </xsl:call-template>
        </td>
        <td>  <!-- 3: Authors -->
            <xsl:call-template name="multiValue">
                <xsl:with-param name="values" select="tei:msItem[1]/tei:author/tei:persName" />
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
            <xsl:call-template name="multiValue">
                <xsl:with-param name="values" select=".//*/tei:name[@type='person' and @role='scribe']" />
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
        <td>  <!-- 28: Related People -->
            <xsl:call-template name="multiValue">
                <xsl:with-param name="values" select=".//*/tei:name[@type='person' and not(@role='scribe') and not(@role='author')]" />
                <xsl:with-param name="include-role" select="true()" />
            </xsl:call-template>
        </td>
    </xsl:template>

    <xsl:template name="places">
        <td>  <!-- 29: Related Places -->
            <xsl:call-template name="multiValue">
                <xsl:with-param name="values" select=".//*/tei:name[@type='place']" />
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