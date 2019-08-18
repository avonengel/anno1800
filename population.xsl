<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:strip-space elements="*"/>

    <xsl:template match="/">
        <xsl:text>{&#xa;</xsl:text>
        <xsl:apply-templates/>
        <xsl:text>}&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="//Asset[Template='PopulationLevel7']">
        <xsl:text>  {&#xa;</xsl:text>
        <xsl:text>    "name": "</xsl:text><xsl:value-of select="Values/Text/LocaText/English/Text"/><xsl:text>",&#xa;</xsl:text>
        <xsl:text>    "guid": "</xsl:text><xsl:value-of select="Values/Standard/GUID"/><xsl:text>",&#xa;</xsl:text>
        <xsl:text>    "associatedRegions": "</xsl:text><xsl:value-of select="Values/Building/AssociatedRegions"/><xsl:text>",&#xa;</xsl:text>
        <xsl:apply-templates select="Values/PopulationLevel7" mode="population"/>
        <xsl:text>  }&#xa;</xsl:text>
        <!-- TODO: figure out how to decide when to add comma in front or after this block -->
    </xsl:template>

    <xsl:template match="Item" mode="population">
        <!-- TODO: PublicServiceBuilding is not handled at all - may also have outputs -->
        <!-- TODO: check what's about the variant handling in anno1800assistant -->
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

    <xsl:template match="PopulationInputs" mode="population">
        <xsl:text>    "inputs": [&#xa;</xsl:text>
        <xsl:apply-templates select="Item" mode="population"/>
        <xsl:text>    ],&#xa;</xsl:text>
    </xsl:template>

    <xsl:template match="text()|@*">
    </xsl:template>
    <xsl:template match="text()|@*" mode="population">
    </xsl:template>
</xsl:stylesheet>