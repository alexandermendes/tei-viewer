<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">
<xsl:output method="xml" />

    <xsl:template name="recursiveCopy">
        <xsl:param name="root" />
        <xsl:for-each select="$root">
            <xsl:for-each select=".">
                <xsl:copy-of select="@*|node()" />
            </xsl:for-each>
        </xsl:for-each>
    </xsl:template>

    <xsl:template match="tei:TEI">
        <record>
            <xsl:apply-templates select=".//tei:msDesc/tei:msIdentifier"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:msContents"/>
            <xsl:call-template name="scribes"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:physDesc"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:history"/>
            <xsl:call-template name="people"/>
            <xsl:call-template name="places"/>
            <xsl:apply-templates select=".//tei:msDesc/tei:additional"/>
        </record>
    </xsl:template>

    <xsl:template match="tei:msIdentifier">
        <idno> <!-- Identifier -->
            <xsl:value-of select="tei:idno" />
        </idno>
    </xsl:template>

    <xsl:template match="tei:msContents">
        <title>  <!-- Title -->
            <xsl:value-of select="tei:msItem[1]/tei:title" />
        </title>
        <author>  <!-- Author -->
            <xsl:value-of select="tei:msItem[1]/tei:author/tei:persName" />
        </author>
        <contentsSummary>  <!-- Contents Summary -->
            <xsl:value-of select="tei:summary" />
        </contentsSummary>
        <language>  <!-- Language -->
            <xsl:value-of select="tei:textLang" />
        </language>
        <decorationsInitialWords>  <!-- Decorations - Initial Words -->
            <xsl:value-of select="tei:msItem[1]/tei:decoNote[@type='initial']" />
        </decorationsInitialWords>
        <decorationsMiniatures>  <!-- Decorations - Miniatures -->
            <xsl:value-of select="tei:msItem[1]/tei:decoNote[@type='miniature']" />
        </decorationsMiniatures>
        <decorationsIllustrations>  <!-- Decorations - Illustrations -->
            <xsl:value-of select="tei:msItem[1]/tei:decoNote[@type='illustration']" />
        </decorationsIllustrations>
        <decorationsParatext>  <!-- Decorations - Paratext -->
            <xsl:value-of select="tei:msItem[1]/tei:decoNote[@type='paratext']" />
        </decorationsParatext>
        <decorationsBorders>  <!-- Decorations - Borders -->
            <xsl:value-of select="tei:msItem[1]/tei:decoNote[@type='border']" />
        </decorationsBorders>
        <decorationsOther>  <!-- Decorations - Other -->
            <xsl:value-of select="tei:msItem[1]/tei:decoNote[@type='other']" />
        </decorationsOther>
        <colophon>  <!-- Colophon -->
            <xsl:value-of select="tei:msItem[1]/tei:colophon" />
        </colophon>
        <notes>  <!-- Notes -->
            <xsl:value-of select="tei:msItem[1]/tei:note" />
        </notes>
        <detailedContents>  <!-- Detailed Contents -->
            <xsl:value-of select="tei:msItem/tei:msItem" />
        </detailedContents>
    </xsl:template>

    <xsl:template name="scribes">
        <scribes>  <!-- Scribes -->
            <xsl:value-of select=".//*/tei:name[@type='person' and @role='scribe']" />
        </scribes>
    </xsl:template>

    <xsl:template match="tei:physDesc">
        <physicalDescription>  <!-- Physical Description -->
            <xsl:value-of select="tei:p" />
        </physicalDescription>
        <material>  <!-- Material -->
            <xsl:value-of select="tei:objectDesc/tei:supportDesc/tei:support" />
        </material>
        <extent>  <!-- Extent -->
            <xsl:value-of select="tei:objectDesc/tei:supportDesc/tei:extent" />
        </extent>
        <collation>  <!-- Collation -->
            <xsl:value-of select="tei:objectDesc/tei:supportDesc/tei:collation" />
        </collation>
        <condition>  <!-- Condition -->
            <xsl:value-of select="tei:objectDesc/tei:supportDesc/tei:condition" />
        </condition>
        <layout>  <!-- Layout -->
            <xsl:value-of select="tei:objectDesc/tei:layoutDesc" />
        </layout>
        <handDesc>  <!-- Hand Description -->
            <xsl:value-of select="tei:handDesc" />
        </handDesc>
        <additions>  <!-- Additions -->
            <xsl:value-of select="tei:additions" />
        </additions>
        <binding>  <!-- Binding -->
            <xsl:value-of select="tei:bindingDesc" />
        </binding>
    </xsl:template>

    <xsl:template match="tei:history">
        <date>  <!-- Date -->
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
        </date>
        <provenance>  <!-- Provenance -->
            <xsl:value-of select="tei:provenance" />
        </provenance>
        <acquisition>  <!-- Acquisition -->
            <xsl:value-of select="tei:acquisition" />
        </acquisition>
    </xsl:template>

    <xsl:template name="people">
        <relatedPeople>  <!-- Related People -->
            <xsl:value-of select=".//*/tei:name[@type='person' and not(@role='scribe') and not(@role='author')]" />
        </relatedPeople>
    </xsl:template>

    <xsl:template name="places">
        <relatedPlaces>  <!-- Related Places -->
            <xsl:value-of select=".//*/tei:name[@type='place']" />
        </relatedPlaces>
    </xsl:template>

    <xsl:template match="tei:additional">
        <recordHistory>  <!-- Record History -->
            <xsl:value-of select="tei:adminInfo/tei:recordHist" />
        </recordHistory>
        <margoliouthID>  <!-- Margoliouth ID -->
            <xsl:value-of select="tei:listBibl/tei:bibl/tei:ref[@target='Margoliouth_1965']" />
        </margoliouthID>
    </xsl:template>

</xsl:stylesheet>