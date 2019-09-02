<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:variable name="coalPowerPlant" select="100779"/>

    <!-- or (BaseAssetGUID != '' and Values/FactoryBase
                                        and BaseAssetGUID != $zoo and BaseAssetGUID != $museum))-->
    <xsl:template match="/">
        <xsl:text>import {PublicServiceAsset} from "./assets";&#xa;</xsl:text>
        <xsl:text>export const PUBLIC_SERVICES: Readonly&lt;PublicServiceAsset[]&gt; = [</xsl:text>
        <xsl:text>&#xa;</xsl:text>
        <xsl:for-each select="descendant::Asset[Values/PublicService
                                    and Values/Building/AssociatedRegions!='']">
            <xsl:if test="Values/Standard/GUID != $coalPowerPlant">
                <xsl:apply-templates select="."/>
                <xsl:text>,&#xa;</xsl:text>
            </xsl:if>
        </xsl:for-each>
        <xsl:text>];&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset">
        <xsl:text>  {</xsl:text>
        <xsl:text>guid: </xsl:text><xsl:value-of select="Values/Standard/GUID"/>
        <xsl:if test="Values/Text/LocaText/English/Text != ''">
            <xsl:text>, name: "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:if test="BaseAssetGUID != ''">
            <xsl:text>, baseGuid: </xsl:text><xsl:value-of select="BaseAssetGUID"/>
        </xsl:if>
        <xsl:text>, associatedRegions: "</xsl:text><xsl:value-of select="Values/Building/AssociatedRegions"/><xsl:text>"</xsl:text>
        <xsl:if test="Values/FactoryBase/CycleTime">
            <xsl:text>, cycleTime: </xsl:text><xsl:value-of select="Values/FactoryBase/CycleTime"/>
        </xsl:if>
        <xsl:apply-templates select="Values/PublicService" mode="publicService"/>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!--    <xsl:template match="PublicService" mode="publicService">-->
    <!--        <xsl:apply-templates mode="publicService"/>-->
    <!--    </xsl:template>-->

    <xsl:template match="Item" mode="publicService">
        <xsl:value-of select="Product"/>
        <xsl:if test="following-sibling::Item">
            <xsl:text>, </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="PublicServiceOutputs[Item/Product]" mode="publicService">
        <xsl:text>, output: </xsl:text>
        <xsl:apply-templates select="Item" mode="publicService"/>
    </xsl:template>
    <xsl:template match="FactoryInputs" mode="publicService">
        <xsl:text>, inputs: [</xsl:text>
        <xsl:apply-templates select="Item" mode="publicService"/>
        <xsl:text>]</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="publicService">
    </xsl:template>
</xsl:stylesheet>