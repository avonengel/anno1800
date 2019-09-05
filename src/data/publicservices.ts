import {PublicServiceAsset} from "./assets";
export const PUBLIC_SERVICES: Readonly<PublicServiceAsset[]> = [
  {guid: 1010358, name: "Pub", associatedRegions: "Moderate", output: 1010349},
  {guid: 1010360, name: "School", associatedRegions: "Moderate", output: 1010351},
  {guid: 1010365, name: "Bank", associatedRegions: "Moderate", output: 1010356},
  {guid: 1010359, name: "Church", associatedRegions: "Moderate", output: 1010350},
  {guid: 1010361, name: "Variety Theatre", associatedRegions: "Moderate", output: 1010352},
  {guid: 1010362, name: "University", associatedRegions: "Moderate", output: 1010353},
  {guid: 1010364, name: "Members Club", associatedRegions: "Moderate", output: 1010355},
  {guid: 1010372, name: "Marketplace", associatedRegions: "Moderate", output: 120020},
  {guid: 100780, name: "Oil Power Plant", associatedRegions: "Moderate", cycleTime: 5},
  {guid: 101257, baseGuid: 1010372, associatedRegions: "Colony01"},
  {guid: 101258, name: "Chapel", baseGuid: 1010359, associatedRegions: "Colony01", output: 120050},
  {guid: 101259, name: "Boxing Arena", baseGuid: 1010358, associatedRegions: "Colony01", output: 1010348},
];
