export const ENHANCE_PRODUCT_DESC_PROMPT = (description) => `
Rewrite this product description as an expert copywriter. 
Make it professional, persuasive, SEO-friendly, and well-structured. 
Focus on benefits and use a clear, logical flow.

Current Description:
${description}

Constraint: Return ONLY the improved text. Do not use markdown (no bold, no italics). Use plain text and simple dashes for lists.
`;

export const ENHANCE_REVIEW_PROMPT = (review) => `
Refine this user review to be clear, natural, and respectful. 
Maintain the user's original sentiment without inventing details or exaggerating. 
Ensure a helpful, genuine tone.

Original Review:
${review}

Return ONLY the improved review. Use plain text only. Do not use markdown (no bold or italics).
`;
