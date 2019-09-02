<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:variable name="zoo" select="1010470"/>
    <xsl:variable name="museum" select="1010471"/>
    <xsl:variable name="coalPowerPlant" select="100779"/>

    <xsl:template match="/">
        <xsl:text>import {FactoryAsset} from "./assets";&#xa;</xsl:text>
        <xsl:text>export const FACTORIES: Readonly&lt;FactoryAsset[]&gt; = [</xsl:text>
        <xsl:text>&#xa;</xsl:text>
        <xsl:for-each select="descendant::Asset[(Template='FactoryBuilding7'
                                        or Template='FarmBuilding'
                                        or Template='HeavyFactoryBuilding'
                                        or Template='HeavyFreeAreaBuilding'
                                        or Template = 'SlotFactoryBuilding7'
                                        or Template = 'FreeAreaBuilding'
                                        or Template = 'PowerplantBuilding'
                                        or (BaseAssetGUID != '' and Values/FactoryBase
                                        and BaseAssetGUID != $zoo and BaseAssetGUID != $museum))
                                    and Values/Standard/GUID != $coalPowerPlant
                                    and Values/Building/AssociatedRegions!='']">
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
        <xsl:if test="Values/Text/LocaText/English/Text != ''">
            <xsl:text>, name: "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:if test="BaseAssetGUID != ''">
            <xsl:text>, baseGuid: </xsl:text><xsl:value-of select="BaseAssetGUID"/>
        </xsl:if>
        <xsl:text>, associatedRegions: "</xsl:text><xsl:value-of select="Values/Building/AssociatedRegions"/><xsl:text>"</xsl:text>
        <xsl:apply-templates select="Values/FactoryBase" mode="factory"/>
        <xsl:if test="Values/FactoryBase/CycleTime">
            <xsl:text>, cycleTime: </xsl:text><xsl:value-of select="Values/FactoryBase/CycleTime"/>
        </xsl:if>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <xsl:template match="FactoryBase" mode="factory">
        <xsl:apply-templates mode="factory"/>
    </xsl:template>

    <xsl:template match="Item" mode="factory">
        <xsl:value-of select="Product"/>
        <xsl:if test="following-sibling::Item">
            <xsl:text>, </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="FactoryOutputs[Item/Product]" mode="factory">
        <xsl:text>, output: </xsl:text>
        <xsl:apply-templates select="Item" mode="factory"/>
    </xsl:template>
    <xsl:template match="FactoryInputs" mode="factory">
        <xsl:text>, inputs: [</xsl:text>
        <xsl:apply-templates select="Item" mode="factory"/>
        <xsl:text>]</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="factory">
    </xsl:template>
</xsl:stylesheet>