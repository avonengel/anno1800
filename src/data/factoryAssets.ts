import {FactoryAsset} from "./assets";
export const FACTORIES: Readonly<FactoryAsset[]> = [
  {guid: 1010262, name: "Grain Farm", associatedRegions: "Moderate", output: 1010192, cycleTime: 60},
  {guid: 1010263, name: "Cattle Farm", associatedRegions: "Moderate", output: 1010193, cycleTime: 120},
  {guid: 1010264, name: "Hop Farm", associatedRegions: "Moderate", output: 1010194, cycleTime: 90},
  {guid: 1010265, name: "Potato Farm", associatedRegions: "Moderate", output: 1010195},
  {guid: 1010266, name: "Lumberjack's Hut", associatedRegions: "Moderate", output: 120008, cycleTime: 15},
  {guid: 1010267, name: "Sheep Farm", associatedRegions: "Moderate", output: 1010197},
  {guid: 1010269, name: "Pig Farm", associatedRegions: "Moderate", output: 1010199, cycleTime: 60},
  {guid: 1010558, name: "Hunting Cabin", associatedRegions: "Moderate", output: 1010209, cycleTime: 60},
  {guid: 100654, name: "Red Pepper Farm", associatedRegions: "Moderate", output: 1010198, cycleTime: 120},
  {guid: 100655, name: "Vineyard", associatedRegions: "Moderate", output: 120014, cycleTime: 120},
  {guid: 1010278, name: "Fishery", associatedRegions: "Moderate", output: 1010200},
  {guid: 1010310, name: "Saltpeter Works", associatedRegions: "Moderate", output: 1010232, cycleTime: 120},
  {guid: 1010560, name: "Sand Mine", associatedRegions: "Moderate", output: 1010228},
  {guid: 1010280, name: "Concrete Factory", associatedRegions: "Moderate", inputs: [1010231, 1010219], output: 1010202, cycleTime: 60},
  {guid: 1010281, name: "Soap Factory", associatedRegions: "Moderate", inputs: [1010234], output: 1010203},
  {guid: 1010283, name: "Brick Factory", associatedRegions: "Moderate", inputs: [1010201], output: 1010205, cycleTime: 60},
  {guid: 100451, name: "Sawmill", associatedRegions: "Moderate", inputs: [120008], output: 1010196, cycleTime: 15},
  {guid: 1010325, name: "Fur Dealer", associatedRegions: "Moderate", inputs: [1010209, 1010240], output: 1010247},
  {guid: 1010286, name: "Light Bulb Factory", associatedRegions: "Moderate", inputs: [1010241, 1010243], output: 1010208, cycleTime: 60},
  {guid: 1010285, name: "Window-Makers", associatedRegions: "Moderate", inputs: [120008, 1010241], output: 1010207, cycleTime: 60},
  {guid: 1010288, name: "Sailmakers", associatedRegions: "Moderate", inputs: [1010197], output: 1010210},
  {guid: 100416, name: "Clay Pit", associatedRegions: "Moderate", output: 1010201},
  {guid: 1010289, name: "Coachmakers", associatedRegions: "Moderate", inputs: [120008, 1010255], output: 1010211, cycleTime: 120},
  {guid: 1010291, name: "Bakery", associatedRegions: "Moderate", inputs: [1010235], output: 1010213, cycleTime: 60},
  {guid: 1010292, name: "Brewery", associatedRegions: "Moderate", inputs: [1010194, 1010236], output: 1010214, cycleTime: 60},
  {guid: 1010293, name: "Artisanal Kitchen", associatedRegions: "Moderate", inputs: [1010193, 1010198], output: 1010215, cycleTime: 120},
  {guid: 1010295, name: "Cannery", associatedRegions: "Moderate", inputs: [1010227, 1010215], output: 1010217, cycleTime: 90},
  {guid: 1010294, name: "Schnapps Distillery", associatedRegions: "Moderate", inputs: [1010195], output: 1010216},
  {guid: 1010316, name: "Butcher's", associatedRegions: "Moderate", inputs: [1010199], output: 1010238, cycleTime: 60},
  {guid: 100659, name: "Champagne Cellar", associatedRegions: "Moderate", inputs: [120014, 1010241], output: 120016},
  {guid: 1010296, name: "Steelworks", associatedRegions: "Moderate", inputs: [1010219], output: 1010218, cycleTime: 45},
  {guid: 1010297, name: "Furnace", associatedRegions: "Moderate", inputs: [1010227, 1010226], output: 1010219},
  {guid: 1010298, name: "Charcoal Kiln", associatedRegions: "Moderate", output: 1010226},
  {guid: 1010299, name: "Weapon Factory", associatedRegions: "Moderate", inputs: [1010219], output: 1010221, cycleTime: 90},
  {guid: 1010301, name: "Heavy Weapons Factory", associatedRegions: "Moderate", inputs: [1010219, 1010222], output: 1010223, cycleTime: 120},
  {guid: 1010302, name: "Motor Assembly Line", associatedRegions: "Moderate", inputs: [1010219, 1010204], output: 1010224, cycleTime: 90},
  {guid: 1010303, name: "Cab Assembly Line", associatedRegions: "Moderate", inputs: [1010211, 1010224], output: 1010225, cycleTime: 60},
  {guid: 1010282, name: "Brass Smeltery", associatedRegions: "Moderate", inputs: [1010229, 1010230], output: 1010204, cycleTime: 60},
  {guid: 101331, name: "Oil Refinery", associatedRegions: "Moderate", output: 1010566, cycleTime: 15},
  {guid: 1010304, name: "Coal Mine", associatedRegions: "Moderate", output: 1010226, cycleTime: 15},
  {guid: 1010305, name: "Iron Mine", associatedRegions: "Moderate", output: 1010227, cycleTime: 15},
  {guid: 1010307, name: "Zinc Mine", associatedRegions: "Moderate", output: 1010229},
  {guid: 1010308, name: "Copper Mine", associatedRegions: "Moderate", output: 1010230},
  {guid: 1010309, name: "Limestone Quarry", associatedRegions: "Moderate", output: 1010231},
  {guid: 1010311, name: "Gold Mine", associatedRegions: "Moderate", output: 1010233, cycleTime: 150},
  {guid: 1010312, name: "Rendering Works", associatedRegions: "Moderate", inputs: [1010199], output: 1010234, cycleTime: 60},
  {guid: 1010313, name: "Flour Mill", associatedRegions: "Moderate", inputs: [1010192], output: 1010235},
  {guid: 1010314, name: "Malthouse", associatedRegions: "Moderate", inputs: [1010192], output: 1010236},
  {guid: 1010315, name: "Framework Knitters", associatedRegions: "Moderate", inputs: [1010197], output: 1010237},
  {guid: 1010300, name: "Dynamite Factory", associatedRegions: "Moderate", inputs: [1010234, 1010232], output: 1010222, cycleTime: 60},
  {guid: 1010319, name: "Glassmakers", associatedRegions: "Moderate", inputs: [1010228], output: 1010241},
  {guid: 1010320, name: "Marquetry Workshop", associatedRegions: "Moderate", inputs: [120008], output: 1010242, cycleTime: 60},
  {guid: 1010321, name: "Filament Factory", associatedRegions: "Moderate", inputs: [1010226], output: 1010243, cycleTime: 60},
  {guid: 1010323, name: "Bicycle Factory", associatedRegions: "Moderate", inputs: [1010255, 1010219], output: 1010245},
  {guid: 1010324, name: "Clockmakers", associatedRegions: "Moderate", inputs: [1010241, 1010249], output: 1010246, cycleTime: 90},
  {guid: 1010284, name: "Sewing Machine Factory", associatedRegions: "Moderate", inputs: [120008, 1010219], output: 1010206},
  {guid: 1010326, name: "Gramophone Factory", associatedRegions: "Moderate", inputs: [1010242, 1010204], output: 1010248, cycleTime: 120},
  {guid: 1010327, name: "Goldsmiths", associatedRegions: "Moderate", inputs: [1010226, 1010233], output: 1010249, cycleTime: 60},
  {guid: 1010328, name: "Jewellers", associatedRegions: "Moderate", inputs: [1010256, 1010249], output: 1010250},
  {guid: 101250, name: "Spectacle Factory", associatedRegions: "Moderate", inputs: [1010241, 1010204], output: 120030, cycleTime: 90},
    // FIXME there is no output of electricity (1010354) here, but electricity is an input with supplyWeight in populationAssets!
  {guid: 100780, name: "Oil Power Plant", associatedRegions: "Moderate", inputs: [1010566], cycleTime: 5},
  {guid: 1010329, name: "Sugar Cane Plantation", associatedRegions: "Colony01", output: 1010251},
  {guid: 1010330, name: "Tobacco Plantation", associatedRegions: "Colony01", output: 1010252, cycleTime: 120},
  {guid: 1010331, name: "Cotton Plantation", associatedRegions: "Colony01", output: 1010253, cycleTime: 60},
  {guid: 1010332, name: "Cocoa Plantation", associatedRegions: "Colony01", output: 1010254, cycleTime: 60},
  {guid: 1010333, name: "Caoutchouc Plantation", associatedRegions: "Colony01", output: 1010255, cycleTime: 60},
  {guid: 101260, baseGuid: 1010266, associatedRegions: "Colony01"},
  {guid: 101251, name: "Coffee Plantation", associatedRegions: "Colony01", output: 120031, cycleTime: 60},
  {guid: 101263, name: "Plantain Plantation", associatedRegions: "Colony01", output: 120041},
  {guid: 101269, baseGuid: 1010263, associatedRegions: "Colony01", cycleTime: 60},
  {guid: 101270, name: "Corn Farm", associatedRegions: "Colony01", output: 120034, cycleTime: 60},
  {guid: 101272, name: "Alpaca Farm", associatedRegions: "Colony01", output: 120036},
  {guid: 1010339, name: "Pearl Farm", associatedRegions: "Colony01", output: 1010256, cycleTime: 90},
  {guid: 101262, name: "Fish Oil Factory", associatedRegions: "Colony01", output: 120042},
  {guid: 101303, baseGuid: 1010310, associatedRegions: "Colony01"},
  {guid: 101261, baseGuid: 100451, associatedRegions: "Colony01"},
  {guid: 101265, baseGuid: 1010288, associatedRegions: "Colony01", inputs: [1010240]},
  {guid: 1010318, name: "Cotton Mill", associatedRegions: "Colony01", inputs: [1010253], output: 1010240},
  {guid: 101267, baseGuid: 100416, associatedRegions: "Colony01"},
  {guid: 101268, baseGuid: 1010283, associatedRegions: "Colony01"},
  {guid: 101415, name: "Felt Producer", associatedRegions: "Colony01", inputs: [120036], output: 120044},
  {guid: 101273, name: "Bombín Weaver", associatedRegions: "Colony01", inputs: [1010240, 120044], output: 120037},
  {guid: 1010340, name: "Rum Distillery", associatedRegions: "Colony01", inputs: [120008, 1010251], output: 1010257},
  {guid: 1010341, name: "Chocolate Factory", associatedRegions: "Colony01", inputs: [1010254, 1010239], output: 1010258},
  {guid: 101252, name: "Coffee Roaster", associatedRegions: "Colony01", inputs: [120031], output: 120032},
  {guid: 101264, name: "Fried Plantain Kitchen", associatedRegions: "Colony01", inputs: [120042, 120041], output: 120033},
  {guid: 101271, name: "Tortilla Maker", associatedRegions: "Colony01", inputs: [1010193, 120034], output: 120035},
  {guid: 1010561, baseGuid: 101331, associatedRegions: "Colony01"},
  {guid: 101311, baseGuid: 1010311, associatedRegions: "Colony01"},
  {guid: 1010317, name: "Sugar Refinery", associatedRegions: "Colony01", inputs: [1010251], output: 1010239},
  {guid: 101266, name: "Poncho Darner", associatedRegions: "Colony01", inputs: [120036], output: 120043},
  {guid: 101296, baseGuid: 1010320, associatedRegions: "Colony01"},
  {guid: 1010342, name: "Cigar Factory", associatedRegions: "Colony01", inputs: [1010252, 1010242], output: 1010259},
];
