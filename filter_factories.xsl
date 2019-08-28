<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:strip-space elements="*"/>

    <xsl:output method="xml" version="1.0" encoding="utf-8" indent="yes"/>

    <!-- your basic identity transform -->
        <xsl:template match="@*|node()" mode="asset">
            <xsl:copy>
                <xsl:apply-templates select="@*|node()" mode="asset"/>
            </xsl:copy>
        </xsl:template>
    <!-- exception -->
    <xsl:template match="Asset[Template='FactoryBuilding7'
                                    or Template='FarmBuilding'
                                    or Template='HeavyFactoryBuilding'
                                    or Template = 'PublicServiceBuilding'
                                    or Template = 'SlotFactoryBuilding7'
                                    or Template = 'FreeAreaBuilding']">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" mode="asset"/>
        </xsl:copy>
    </xsl:template>

    <!-- override default text copy -->
    <xsl:template match="text()"/>
</xsl:stylesheet>