<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:template match="/">
        <xsl:text>{&#xa;</xsl:text>
        <xsl:apply-templates/>
        <xsl:text>}&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset[Template='FactoryBuilding7'
                                    or Template='FarmBuilding'
                                    or Template='HeavyFactoryBuilding'
                                    or Template = 'PublicServiceBuilding'
                                    or Template = 'SlotFactoryBuilding7'
                                    or Template = 'FreeAreaBuilding']">
        <xsl:text>  {&#xa;</xsl:text>
        <xsl:text>    "name": "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>",&#xa;</xsl:text>
        <xsl:text>    "guid": "</xsl:text><xsl:value-of select="Values/Standard/GUID"/><xsl:text>",&#xa;</xsl:text>
        <xsl:text>    "associatedRegions": "</xsl:text><xsl:value-of select="Values/Building/AssociatedRegions"/><xsl:text>",&#xa;</xsl:text>
        <xsl:apply-templates select="Values/FactoryBase" mode="factory"/>
        <xsl:if test="Values/FactoryBase/CycleTime">
            <xsl:text>    "cycleTime": "</xsl:text><xsl:value-of select="Values/FactoryBase/CycleTime"/><xsl:text>"&#xa;</xsl:text>
        </xsl:if>
        <xsl:text>  }&#xa;</xsl:text>
    </xsl:template>

    <xsl:template name="getTemplateText">
        <xsl:value-of select="Template"/>
    </xsl:template>

    <xsl:template match="FactoryBase" mode="factory">
        <xsl:apply-templates mode="factory"/>
    </xsl:template>

    <xsl:template match="Item" mode="factory">
        <xsl:text>      {&#xa;</xsl:text>
        <xsl:text>        "product": </xsl:text>
        <xsl:value-of select="Product"/>
        <xsl:text>,&#xa;</xsl:text>
        <xsl:text>        "amount": </xsl:text>
        <xsl:value-of select="Amount"/>
        <xsl:text>&#xa;</xsl:text>
        <xsl:choose>
            <xsl:when test="following-sibling::Item">
                <xsl:text>      },&#xa;</xsl:text>
            </xsl:when>
            <xsl:otherwise>
                <xsl:text>      }&#xa;</xsl:text>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="FactoryOutputs" mode="factory">
        <xsl:text>    "outputs": [&#xa;</xsl:text>
        <xsl:apply-templates select="Item" mode="factory"/>
        <xsl:text>    ],&#xa;</xsl:text>
    </xsl:template>
    <xsl:template match="FactoryInputs" mode="factory">
        <xsl:text>    "inputs": [&#xa;</xsl:text>
        <xsl:apply-templates select="Item" mode="factory"/>
        <xsl:text>    ],&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="factory">
    </xsl:template>
</xsl:stylesheet>