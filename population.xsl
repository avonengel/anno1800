<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:template match="/">
        <xsl:text>import {PopulationAsset} from "./populationTypes";&#xa;</xsl:text>
        <xsl:text>export const POPULATIONS: Readonly&lt;PopulationAsset[]&gt; = [&#xa;</xsl:text>
        <xsl:apply-templates/>
        <xsl:text>];&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset[Template='PopulationLevel7']">
        <xsl:text>  {</xsl:text>
        <xsl:text>name: "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>"</xsl:text>
        <xsl:variable name="guid" select="Values/Standard/GUID"/>
        <xsl:text>, guid: </xsl:text><xsl:value-of select="$guid"/>
        <xsl:text>, associatedRegions: "</xsl:text><xsl:value-of
            select="//Asset[Values/Residence7/PopulationLevel7 = $guid]/Values/Building/AssociatedRegions"/><xsl:text>"</xsl:text>
        <xsl:apply-templates select="Values/PopulationLevel7/PopulationInputs"/>
        <xsl:text>},&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="PopulationInputs">
        <xsl:text>, inputs: [&#xa;</xsl:text>
        <xsl:apply-templates select="Item" mode="population"/>
        <xsl:text>  ]</xsl:text>
    </xsl:template>

    <xsl:template match="Item" mode="population">
        <xsl:text>    {</xsl:text>
        <xsl:text>product: </xsl:text><xsl:value-of select="Product"/>
        <xsl:if test="SupplyWeight">
            <xsl:text>, supplyWeight: </xsl:text><xsl:value-of select="SupplyWeight"/>
        </xsl:if>
        <xsl:if test="Amount">
            <xsl:text>, amount: </xsl:text><xsl:value-of select="Amount"/>
        </xsl:if>
        <xsl:if test="NoWeightPopulationCount">
            <xsl:text>, noWeightPopulationCount: </xsl:text><xsl:value-of select="NoWeightPopulationCount"/>
        </xsl:if>
        <xsl:text>},&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="population">
    </xsl:template>
</xsl:stylesheet>