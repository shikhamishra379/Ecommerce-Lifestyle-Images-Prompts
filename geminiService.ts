
import { GoogleGenAI, Type } from "@google/genai";
import { ProductInput, GenerationResult, ScenarioType } from "./types";

const SYSTEM_INSTRUCTION = `You are a World-Class E-commerce Prompt Engineer and Commercial Photographer.
Your objective is to generate exactly 6 distinct, professional AI image generation blueprints based on a product's name and category.

PROMPT BLUEPRINT STRUCTURE (11 MANDATORY SECTIONS):
1. HEADER: A clear, concise summary of the shot.
2. SCENE & ENVIRONMENT: Detailed description of the background, atmosphere, and setting.
3. PLACEMENT & INTERACTION: How the product @img1 is positioned. Include specific hand interactions or model poses if relevant (natural skin, realistic pores, candid expressions).
4. SUPPORTING PROPS: Specific items that complement the product without cluttering.
5. PRODUCT INTEGRITY RULES: (CRITICAL) Mention @img1 specifically. Instructions to never change labels, logos, colors, or proportions.
6. LIGHTING GEOMETRY: Technical lighting setup (e.g., Rembrandt, Butterfly, Rim lighting, Profoto softboxes).
7. CAMERA & COMPOSITION: Specific gear (Sony A7R V, Hasselblad), lens focal length, and framing (Rule of thirds, golden ratio).
8. STYLE & COLOR GRADING: Film-like softness, natural saturation, specific color palettes, or e-commerce clean aesthetics.
9. TECH SPECS: 8K, RAW, ray-tracing, shutter speeds (especially for pets/action).
10. QUALITY METRICS: Masterpiece quality, high-fidelity, photorealistic.
11. NEGATIVE PROMPTS: Specific anti-AI terms (plastic skin, airbrushed, CGI, bad anatomy, artificial fur).

CATEGORY-SPECIFIC LOGIC:
- FASHION/WEARABLES: Focus on "Editorial" looks. Models must look natural, diverse, and have "authentic skin texture" (no plastic looks).
- WATCHES/JEWELRY: Focus on "Luxury" looks. High-end lighting (Rim/Spot), macro clarity, and expensive environments.
- PET SUPPLIES: Focus on "Active/Heartfelt" looks. Freeze-action shutter speeds, natural fur textures (moist noses, intelligent eyes).
- TECH/ELECTRONICS: Focus on "Minimal/Modern" looks. Clean lines, studio precision, cold or warm accent lighting.

Every prompt MUST use '@img1' to refer to the product to ensure the AI knows to preserve the uploaded reference.`;

export const generateProfessionalPrompts = async (input: ProductInput): Promise<GenerationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-pro-preview";

  const contents: any[] = [
    { text: `Product: ${input.name}\nCategory: ${input.category}\nGenerate 6 bespoke commercial photography blueprints using the 11-section format. Refer to the product as @img1. Ensure the prompts are category-intelligent (e.g., if it's a wearable, include natural human skin instructions; if it's a pet product, focus on fur and movement). Ensure 0% AI-monotony and 100% natural, high-end photography standards.` }
  ];

  if (input.image) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: input.image.split(",")[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          blueprints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scenarioType: { type: Type.STRING, enum: Object.values(ScenarioType) },
                header: { type: Type.STRING },
                scene: { type: Type.STRING, description: "Scene & Environment details" },
                placement: { type: Type.STRING, description: "Placement & Interaction (Hand/Model interaction)" },
                supportingProps: { type: Type.STRING },
                dynamicElements: { type: Type.STRING, description: "Product Integrity Rules (must use @img1)" },
                lighting: { type: Type.STRING, description: "Lighting Geometry" },
                camera: { type: Type.STRING, description: "Camera & Composition" },
                color: { type: Type.STRING, description: "Style & Color Grading" },
                techSpecs: { type: Type.STRING },
                quality: { type: Type.STRING, description: "Quality Metrics" },
                negativePrompts: { type: Type.STRING },
              },
              required: ["scenarioType", "header", "scene", "placement", "supportingProps", "dynamicElements", "lighting", "camera", "color", "techSpecs", "quality", "negativePrompts"]
            }
          },
          analysis: { type: Type.STRING, description: "Brief visual identity report." }
        },
        required: ["blueprints"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return data as GenerationResult;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw error;
  }
};
