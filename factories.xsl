<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:template match="/">
        <xsl:text>export interface FactoryAsset {&#xa;</xsl:text>
        <xsl:text>  guid: number;&#xa;</xsl:text>
        <xsl:text>  name: string;&#xa;</xsl:text>
        <xsl:text>  associatedRegions: string;&#xa;</xsl:text>
        <xsl:text>  cycleTime?: number;&#xa;</xsl:text>
        <xsl:text>  inputs?: number[];&#xa;</xsl:text>
        <xsl:text>  output?: number;&#xa;</xsl:text>
        <xsl:text>}&#xa;&#xa;</xsl:text>
        <xsl:text>export const FACTORIES_BY_ID: ReadonlyMap&lt;number, FactoryAsset&gt; = new Map([</xsl:text>
        <xsl:text>&#xa;</xsl:text>
        <xsl:for-each select="descendant::Asset[(Template='FactoryBuilding7'
                                    or Template='FarmBuilding'
                                    or Template='HeavyFactoryBuilding'
                                    or Template='HeavyFreeAreaBuilding'
                                    or Template = 'SlotFactoryBuilding7'
                                    or Template = 'FreeAreaBuilding')
                                    and Values/Building/AssociatedRegions!='']">
            <!-- Values/Building/AssociatedRegions is empty for buildings like "Edvard's Timber Yard" -->
            <!-- FIXME buildings that exist in both worlds are really strangely modeled in the XML, see <BaseAssetGUID>1010266</BaseAssetGUID> <GUID>101260</GUID> <Name>agriculture_colony01_06 (Timber Yard)</Name>-->
            <xsl:apply-templates select="."/>
            <xsl:if test="not(position() = last())">
                <xsl:text>,</xsl:text>
            </xsl:if>
            <xsl:text>&#xa;</xsl:text>
        </xsl:for-each>
        <xsl:text>]);&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset">
        <xsl:text>  [</xsl:text><xsl:value-of select="Values/Standard/GUID"/><xsl:text>, {</xsl:text>
        <xsl:text>name: "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>"</xsl:text>
        <xsl:text>, "guid": </xsl:text><xsl:value-of select="Values/Standard/GUID"/>
        <xsl:text>, associatedRegions: "</xsl:text><xsl:value-of select="Values/Building/AssociatedRegions"/><xsl:text>"</xsl:text>
        <xsl:apply-templates select="Values/FactoryBase" mode="population"/>
        <xsl:if test="Values/FactoryBase/CycleTime">
            <xsl:text>, cycleTime: </xsl:text><xsl:value-of select="Values/FactoryBase/CycleTime"/>
        </xsl:if>
        <xsl:text>}]</xsl:text>
    </xsl:template>

    <xsl:template name="getTemplateText">
        <xsl:value-of select="Template"/>
    </xsl:template>

    <xsl:template match="FactoryBase" mode="population">
        <xsl:apply-templates mode="population"/>
    </xsl:template>

    <xsl:template match="Item" mode="population">
        <!-- TODO: PublicServiceOutputs is not handled at all -->
        <!-- TODO: check what's about the variant handling in anno1800assistant -->
        <xsl:value-of select="Product"/>
        <xsl:if test="following-sibling::Item">
            <xsl:text>, </xsl:text>
        </xsl:if>
    </xsl:template>

    <xsl:template match="FactoryOutputs" mode="population">
        <xsl:text>, output: </xsl:text>
        <xsl:apply-templates select="Item" mode="population"/>
    </xsl:template>
    <xsl:template match="FactoryInputs" mode="population">
        <xsl:text>, inputs: [</xsl:text>
        <xsl:apply-templates select="Item" mode="population"/>
        <xsl:text>]</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="population">
    </xsl:template>
</xsl:stylesheet>