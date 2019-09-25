<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:variable name="strategicGoods" select="501593"/>

    <xsl:template match="/">
        <xsl:text>import {FilterAsset} from "./assets";&#xa;</xsl:text>
        <xsl:text>export const FILTERS: Readonly&lt;FilterAsset[]&gt; = [</xsl:text>
        <xsl:text>&#xa;</xsl:text>
        <xsl:for-each select="descendant::Asset[(Template='ProductFilter')
                                            and Values/Standard/GUID != $strategicGoods]">
            <!-- Values/Building/AssociatedRegions is empty for buildings like "Edvard's Timber Yard" -->
            <!-- Asset with BaseAssetGUID means it's something that 'extends' a base: mostly buildings in the new world,
                that are slightly different than in the old world (e.g. Sailmakers) -->
            <xsl:apply-templates select="."/>
            <xsl:text>,&#xa;</xsl:text>
        </xsl:for-each>
        <xsl:text>];&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset">
        <xsl:text>  {</xsl:text>
        <xsl:text>guid: </xsl:text><xsl:value-of select="Values/Standard/GUID"/>
        <xsl:text>, name: "</xsl:text><xsl:value-of select="Values/Standard/Name"/><xsl:text>"</xsl:text>
        <xsl:if test="BaseAssetGUID != ''">
            <xsl:text>, baseGuid: </xsl:text><xsl:value-of select="BaseAssetGUID"/>
        </xsl:if>
        <xsl:text>, options: {&#xa;</xsl:text>
        <xsl:apply-templates mode="filter"/>
        <xsl:text>  }}</xsl:text>
    </xsl:template>

    <xsl:template match="Item" mode="filter">
        <xsl:variable name="categoryId" select="CategoryAsset"/>
        <xsl:text>  "</xsl:text>
        <xsl:variable name="categoryAsset" select="//Asset[Values/Standard/GUID = $categoryId]"/>
        <xsl:choose>
            <xsl:when test="$categoryAsset/Values/Text/LocaText/English/Text">
                <xsl:value-of select="$categoryAsset/Values/Text/LocaText/English/Text"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="$categoryAsset/Values/Standard/Name"/>
            </xsl:otherwise>
        </xsl:choose>
        <xsl:text>": [</xsl:text>
        <xsl:for-each select="Products/Item/Product">
            <xsl:value-of select="."/>
            <xsl:text>, </xsl:text>
        </xsl:for-each>
        <xsl:text>],&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="filter">
    </xsl:template>
</xsl:stylesheet>