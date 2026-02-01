import { ScenarioType, PromptBlueprint } from './types';

export const CATEGORIES = [
  "Beauty & Personal Care",
  "Health, Household & Baby Care",
  "Clothing, Shoes & Jewelry",
  "Women's Fashion",
  "Men's Fashion",
  "Kids' & Baby Fashion",
  "Luxury Stores",
  "Electronics & Tech",
  "Cell Phones & Accessories",
  "Computers & Tablets",
  "Home & Kitchen",
  "Pet Supplies",
  "Garden & Outdoor",
  "Appliances",
  "Tools & Home Improvement",
  "Automotive Parts",
  "Grocery & Gourmet Food",
  "Sports & Outdoors",
  "Musical Instruments",
  "Office Products",
  "Toys & Games",
  "Arts, Crafts & Sewing",
  "Books & Media",
  "Collectibles & Fine Art",
  "Handmade Products",
  "Luggage & Travel Gear",
  "Industrial & Scientific"
];

export const getFallbackBlueprints = (productName: string, category: string): PromptBlueprint[] => {
  const isFashion = category.includes("Fashion") || category.includes("Clothing") || category.includes("Jewelry");
  const isTech = category.includes("Electronics") || category.includes("Computers") || category.includes("Phones");
  const isHome = category.includes("Home") || category.includes("Appliances") || category.includes("Garden");
  const isLuxury = category.includes("Luxury") || category.includes("Jewelry") || category.includes("Fine Art");
  const isSmall = category.includes("Beauty") || category.includes("Jewelry") || category.includes("Grocery");
  const isPet = category.includes("Pet");

  return Object.values(ScenarioType).map(type => {
    let camera = "Hasselblad H6D-400c, 80mm lens";
    let lighting = "Soft-box diffused studio lighting";
    let scene = `A professional commercial environment optimized for ${category}`;
    let techSpecs = "8K, highly detailed, raw photo format";

    if (isLuxury) {
      camera = "Phase One XF, 100mm Trichromatic lens";
      lighting = "Cinematic rim lighting with subtle lens flares and high contrast";
      techSpecs = "Ultra-high fidelity, 16K textures, ray-traced reflections";
    } else if (isFashion) {
      camera = "Sony A1 with 85mm f/1.4 G Master lens";
      lighting = "Natural window light with a soft bounce reflector";
    } else if (isTech) {
      camera = "Leica SL2, 50mm Summilux lens";
      lighting = "Clean futuristic neon accents and cold white key lights";
    } else if (isPet) {
      camera = "Sony A9 III with 70-200mm f/2.8 GM II lens";
      lighting = "High-speed sync flash or bright, flicker-free LED panels";
      techSpecs = "Action-freeze 1/2000s shutter, ultra-sharp fur detail";
    } else if (isSmall && type === ScenarioType.MACRO_TEXTURE) {
      camera = "Sony A7R V with 90mm f/2.8 Macro lens";
      lighting = "Ring flash for even light distribution across fine textures";
    }

    const isHumanFocused = type === ScenarioType.HUMAN_CONNECTION || type === ScenarioType.LIFESTYLE_HERO;
    const skinDirective = isHumanFocused ? "Featuring models with authentic skin textures, natural pores, diverse complexions, and candid human expressions." : "";
    const petDirective = isPet ? "Capturing authentic animal expressions, detailed fur textures, and natural animal-human interactions." : "";

    return {
      scenarioType: type,
      header: `Commercial ${type} for ${productName}`,
      scene: `${scene}. ${skinDirective} ${petDirective}`.trim(),
      placement: isFashion && isHumanFocused ? "Full body or three-quarter shot with natural posture." : "Golden ratio composition with purposeful negative space.",
      supportingProps: isHome ? "Living room environment with high-end Scandinavian furniture." : "Understated premium props that complement the product color story.",
      dynamicElements: isPet ? "Active motion blur on moving tails or soft-focus flying toys." : "Subtle atmospheric dust particles or soft-focus background motion.",
      lighting: lighting,
      camera: camera,
      color: isTech ? "Monochromatic with sharp accent highlights." : "Natural, organic color palette with accurate skin tones.",
      techSpecs: techSpecs,
      quality: "Masterpiece quality, sharp focus on primary product, soft natural fall-off.",
      negativePrompts: "Plastic skin, airbrushed, CGI, doll-like faces, over-saturated, blurry, watermarks, bad anatomy, artificial fur sheen."
    };
  });
};