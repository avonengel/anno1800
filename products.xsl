<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:variable name="stoneCoal" select="120021"/>
    <xsl:variable name="scrap" select="112518"/>
    <xsl:variable name="scrap2" select="112520"/>
    <xsl:variable name="scrap3" select="112523"/>
    <xsl:variable name="unknownStuff" select="193482"/>

    <xsl:template match="/">
        <xsl:text>import {ProductAsset} from "./assets";&#xa;</xsl:text>
        <xsl:text>export const PRODUCTS: Readonly&lt;ProductAsset[]&gt; = [</xsl:text>
        <xsl:text>&#xa;</xsl:text>
        <xsl:for-each select="descendant::Asset[(Template='Product'
                                        and Values/Standard/GUID != $stoneCoal
                                        and Values/Standard/GUID != $scrap
                                        and Values/Standard/GUID != $scrap2
                                        and Values/Standard/GUID != $scrap3
                                        and Values/Standard/GUID != $unknownStuff)]">
            <xsl:apply-templates select="."/>
        </xsl:for-each>
        <xsl:text>];&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset">
        <xsl:text>  {</xsl:text>
        <xsl:text>guid: </xsl:text><xsl:value-of select="Values/Standard/GUID"/>
        <xsl:if test="Values/Text/LocaText/English/Text != ''">
            <xsl:text>, name: "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:if test="Values/Product/CivLevel != ''">
            <xsl:text>, civLevel: </xsl:text><xsl:value-of select="Values/Product/CivLevel"/>
        </xsl:if>
        <xsl:if test="Values/Product/IsAbstract">
            <xsl:text>, isAbstract: true</xsl:text>
        </xsl:if>
        <xsl:variable name="productCategory" select="Values/Product/ProductCategory"/>
        <xsl:if test="$productCategory">
            <xsl:text>, productCategory: </xsl:text><xsl:value-of select="$productCategory"/>
            <xsl:text>, categoryName: "</xsl:text>
            <xsl:value-of select="//Asset[Template='Text' and Values/Standard/GUID = $productCategory]/Values/Text/LocaText/English/Text"/>
            <xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:text>},&#xa;</xsl:text>
    </xsl:template>


    <xsl:template match="text()|@*">
    </xsl:template>
</xsl:stylesheet>