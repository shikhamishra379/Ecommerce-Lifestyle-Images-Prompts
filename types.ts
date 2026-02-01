
export enum ScenarioType {
  LIFESTYLE_HERO = "Lifestyle Hero",
  MACRO_TEXTURE = "Macro Texture",
  ENVIRONMENTAL_STORY = "Environmental Story",
  HUMAN_CONNECTION = "Human Connection",
  ARTISTIC_FLAT_LAY = "Artistic Flat-lay",
  CATALOG_STANDARD = "Catalog Standard"
}

export interface PromptBlueprint {
  header: string;
  scene: string;
  placement: string;
  supportingProps: string;
  dynamicElements: string;
  lighting: string;
  camera: string;
  color: string;
  techSpecs: string;
  quality: string;
  negativePrompts: string;
  scenarioType: ScenarioType;
}

export interface GenerationResult {
  blueprints: PromptBlueprint[];
  analysis?: string;
}

export interface ProductInput {
  name: string;
  category: string;
  image?: string; // base64
}
