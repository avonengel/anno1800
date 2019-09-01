import {ProductAsset} from "./productTypes";
export const PRODUCTS: Readonly<ProductAsset[]> = [
  {guid: 1010017, name: "Coins"},
  {guid: 1010190, name: "Influence"},
  {guid: 1010052, name: "Farmer Workforce"},
  {guid: 1010115, name: "Worker Workforce"},
  {guid: 1010116, name: "Artisan Workforce"},
  {guid: 1010117, name: "Engineer Workforce"},
  {guid: 1010128, name: "Investor Workforce"},
  {guid: 1010366, name: "Jornalero Workforce"},
  {guid: 1010367, name: "Obrero Workforce"},
  {guid: 1010368, name: "Cratspeople Workforce"},
  {guid: 1010369, name: "Graduate Workforce"},
  {guid: 1010370, name: "Great Landowner Workforce"},
  {guid: 120020, name: "Market", isAbstract: true, productCategory: 11708, categoryName: "Basic Need"},
  {guid: 1010349, name: "Pub", isAbstract: true, productCategory: 11709, categoryName: "Luxury Need"},
  {guid: 1010350, name: "Church", isAbstract: true, productCategory: 11709, categoryName: "Luxury Need"},
  {guid: 1010351, name: "School", isAbstract: true, productCategory: 11708, categoryName: "Basic Need"},
  {guid: 1010352, name: "Variety Theatre", isAbstract: true, productCategory: 11709, categoryName: "Luxury Need"},
  {guid: 1010353, name: "University", isAbstract: true, productCategory: 11708, categoryName: "Basic Need"},
  {guid: 1010354, name: "Electricity", isAbstract: true, productCategory: 11708, categoryName: "Basic Need"},
  {guid: 1010355, name: "Members Club", isAbstract: true, productCategory: 11709, categoryName: "Luxury Need"},
  {guid: 1010356, name: "Bank", isAbstract: true, productCategory: 11709, categoryName: "Luxury Need"},
  {guid: 120050, name: "Chapel", isAbstract: true, productCategory: 11709, categoryName: "Luxury Need"},
  {guid: 1010348, name: "Boxing Arena", isAbstract: true, productCategory: 11709, categoryName: "Luxury Need"},
  {guid: 1010192, name: "Grain", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010193, name: "Beef", civLevel: 3, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010194, name: "Hops", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010195, name: "Potatoes", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 120008, name: "Wood", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010197, name: "Wool", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010199, name: "Pigs", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010209, name: "Furs", civLevel: 3, productCategory: 11702, categoryName: "Resource"},
  {guid: 120014, name: "Grapes", civLevel: 5, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010198, name: "Red Peppers", civLevel: 3, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010200, name: "Fish", civLevel: 1, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010232, name: "Saltpeter", civLevel: 5, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010228, name: "Quartz Sand", civLevel: 3, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010202, name: "Reinforced Concrete", civLevel: 4, productCategory: 11707, categoryName: "Construction Material"},
  {guid: 1010203, name: "Soap", civLevel: 2, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010196, name: "Timber", civLevel: 1, productCategory: 11707, categoryName: "Construction Material"},
  {guid: 1010205, name: "Bricks", civLevel: 2, productCategory: 11707, categoryName: "Construction Material"},
  {guid: 1010247, name: "Fur Coats", civLevel: 3, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010207, name: "Windows", civLevel: 3, productCategory: 11707, categoryName: "Construction Material"},
  {guid: 1010208, name: "Light Bulbs", civLevel: 4, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010210, name: "Sails", civLevel: 2, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010211, name: "Chassis", civLevel: 5, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010201, name: "Clay", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010206, name: "Sewing Machines", civLevel: 3, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010213, name: "Bread", civLevel: 2, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010214, name: "Beer", civLevel: 2, productCategory: 11705, categoryName: "Luxury Need"},
  {guid: 1010215, name: "Goulash", civLevel: 3, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010217, name: "Canned Food", civLevel: 3, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010216, name: "Schnapps", civLevel: 1, productCategory: 11705, categoryName: "Luxury Need"},
  {guid: 1010238, name: "Sausages", civLevel: 2, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 120016, name: "Champagne", civLevel: 5, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010218, name: "Steel Beams", civLevel: 2, productCategory: 11707, categoryName: "Construction Material"},
  {guid: 1010219, name: "Steel", civLevel: 2, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010221, name: "Weapons", civLevel: 2, productCategory: 11707, categoryName: "Construction Material"},
  {guid: 1010222, name: "Dynamite", civLevel: 5, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010223, name: "Advanced Weapons", civLevel: 5, productCategory: 11707, categoryName: "Construction Material"},
  {guid: 1010224, name: "Steam Motors", civLevel: 4, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010225, name: "Steam Carriages", civLevel: 5, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010204, name: "Brass", civLevel: 4, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010226, name: "Coal", civLevel: 4, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010227, name: "Iron", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010229, name: "Zinc", civLevel: 4, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010230, name: "Copper", civLevel: 4, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010231, name: "Cement", civLevel: 4, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010233, name: "Gold Ore", civLevel: 4, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010234, name: "Tallow", civLevel: 2, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010235, name: "Flour", civLevel: 2, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010236, name: "Malt", civLevel: 2, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010237, name: "Work Clothes", civLevel: 1, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010241, name: "Glass", civLevel: 3, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010242, name: "Wood Veneers", civLevel: 5, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010243, name: "Filaments", civLevel: 4, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010245, name: "Penny Farthings", civLevel: 4, productCategory: 11705, categoryName: "Luxury Need"},
  {guid: 1010246, name: "Pocket Watches", civLevel: 4, productCategory: 11705, categoryName: "Luxury Need"},
  {guid: 120030, name: "Glasses", civLevel: 4, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010248, name: "Gramophones", civLevel: 5, productCategory: 11705, categoryName: "Luxury Need"},
  {guid: 1010249, name: "Gold", civLevel: 4, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010250, name: "Jewelry", civLevel: 5, productCategory: 11705, categoryName: "Luxury Need"},
  {guid: 1010251, name: "Sugar Cane", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010252, name: "Tobacco", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010253, name: "Cotton", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010254, name: "Cocoa", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010255, name: "Caoutchouc", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 120031, name: "Coffee Beans", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 120034, name: "Corn", civLevel: 2, productCategory: 11702, categoryName: "Resource"},
  {guid: 120036, name: "Alpaca Wool", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 120041, name: "Plantains", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 1010256, name: "Pearls", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 120042, name: "Fish Oil", civLevel: 1, productCategory: 11702, categoryName: "Resource"},
  {guid: 120043, name: "Ponchos", civLevel: 1, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 120044, name: "Felt", civLevel: 2, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 120037, name: "Bombins", civLevel: 2, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010257, name: "Rum", civLevel: 1, productCategory: 11705, categoryName: "Luxury Need"},
  {guid: 1010258, name: "Chocolate", civLevel: 1, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 120032, name: "Coffee", civLevel: 2, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 120033, name: "Fried Plantains", civLevel: 1, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 120035, name: "Tortillas", civLevel: 1, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010239, name: "Sugar", civLevel: 1, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010240, name: "Cotton Fabric", civLevel: 1, productCategory: 11703, categoryName: "Processing Good"},
  {guid: 1010259, name: "Cigars", civLevel: 2, productCategory: 11704, categoryName: "Basic Need"},
  {guid: 1010566, name: "Oil", civLevel: 4, productCategory: 11797, categoryName: "Strategic Resource"},
  {guid: 120022, name: "Electricity", isAbstract: true},
];
