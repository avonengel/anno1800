<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:template match="/">
        <xsl:text>[&#xa;</xsl:text>
        <xsl:for-each select="descendant::Asset[Template='FactoryBuilding7'
                                    or Template='FarmBuilding'
                                    or Template='HeavyFactoryBuilding'
                                    or Template = 'PublicServiceBuilding'
                                    or Template = 'SlotFactoryBuilding7'
                                    or Template = 'FreeAreaBuilding']">
            <xsl:apply-templates select="."/>
            <xsl:if test="not(position() = last())">
                <xsl:text>,</xsl:text>
            </xsl:if>
            <xsl:text>&#xa;</xsl:text>
        </xsl:for-each>
        <xsl:text>]&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset[Template='FactoryBuilding7'
                                    or Template='FarmBuilding'
                                    or Template='HeavyFactoryBuilding'
                                    or Template = 'PublicServiceBuilding'
                                    or Template = 'SlotFactoryBuilding7'
                                    or Template = 'FreeAreaBuilding']">
        <xsl:text>  {</xsl:text>
        <xsl:text>"name": "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>"</xsl:text>
        <xsl:text>,"guid": "</xsl:text><xsl:value-of select="Values/Standard/GUID"/><xsl:text>"</xsl:text>
        <xsl:text>,"associatedRegions": "</xsl:text><xsl:value-of select="Values/Building/AssociatedRegions"/><xsl:text>"</xsl:text>
        <xsl:apply-templates select="Values/FactoryBase" mode="population"/>
        <xsl:if test="Values/FactoryBase/CycleTime">
            <xsl:text>,"cycleTime": "</xsl:text><xsl:value-of select="Values/FactoryBase/CycleTime"/><xsl:text>"</xsl:text>
        </xsl:if>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <xsl:template name="getTemplateText">
        <xsl:value-of select="Template"/>
    </xsl:template>

    <xsl:template match="FactoryBase" mode="population">
        <xsl:apply-templates mode="population"/>
    </xsl:template>

    <xsl:template match="Item" mode="population">
        <!-- TODO: PublicServiceBuilding is not handled at all - may also have outputs -->
        <!-- TODO: check what's about the variant handling in anno1800assistant -->
        <xsl:text>{</xsl:text>
        <xsl:text>"product": </xsl:text>
        <xsl:value-of select="Product"/>
        <xsl:text>,"amount": </xsl:text>
        <xsl:value-of select="Amount"/>
        <xsl:choose>
            <xsl:when test="following-sibling::Item">
                <xsl:text>},</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>}</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="FactoryOutputs" mode="population">
        <xsl:text>",outputs": [</xsl:text>
        <xsl:apply-templates select="Item" mode="population"/>
        <xsl:text>]</xsl:text>
    </xsl:template>
    <xsl:template match="FactoryInputs" mode="population">
        <xsl:text> ",inputs": [</xsl:text>
        <xsl:apply-templates select="Item" mode="population"/>
        <xsl:text>]</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="population">
    </xsl:template>
</xsl:stylesheet>