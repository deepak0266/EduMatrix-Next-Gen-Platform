/**
 * Summary length options
 */
export const SUMMARY_LENGTHS = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long'
  };
  
  /**
   * Summary format options
   */
  export const SUMMARY_FORMATS = {
    PARAGRAPHS: 'paragraphs',
    BULLETS: 'bullets',
    KEY_POINTS: 'key_points'
  };
  
  /**
   * Summary length descriptions
   */
  export const SUMMARY_LENGTH_DESCRIPTIONS = {
    [SUMMARY_LENGTHS.SHORT]: 'Concise overview with main points (1-2 paragraphs)',
    [SUMMARY_LENGTHS.MEDIUM]: 'Balanced summary with key details (3-4 paragraphs)',
    [SUMMARY_LENGTHS.LONG]: 'Comprehensive coverage of content (5+ paragraphs)'
  };
  
  /**
   * Summary format descriptions
   */
  export const SUMMARY_FORMAT_DESCRIPTIONS = {
    [SUMMARY_FORMATS.PARAGRAPHS]: 'Traditional paragraph format',
    [SUMMARY_FORMATS.BULLETS]: 'Bulleted list of important points',
    [SUMMARY_FORMATS.KEY_POINTS]: 'Key points organized by section'
  };
  
  /**
   * Tokens per summary length (approximate)
   */
  export const SUMMARY_LENGTH_TOKENS = {
    [SUMMARY_LENGTHS.SHORT]: 150,
    [SUMMARY_LENGTHS.MEDIUM]: 300,
    [SUMMARY_LENGTHS.LONG]: 500
  };
  /**
 * Default options for summary generation
 */
export const DEFAULT_SUMMARY_OPTIONS = {
    length: SUMMARY_LENGTHS.MEDIUM,
    format: SUMMARY_FORMATS.PARAGRAPHS,
    includeTitle: true,
    includeSubheadings: true,
    includeSources: false
  };
  
  /**
   * Summary types available in the system
   */
  export const SUMMARY_TYPES = {
    STUDY_NOTES: 'study_notes',
    CONCEPT_OVERVIEW: 'concept_overview',
    KEY_TAKEAWAYS: 'key_takeaways',
    EXECUTIVE_SUMMARY: 'executive_summary'
  };
  
  /**
   * Summary type descriptions
   */
  export const SUMMARY_TYPE_DESCRIPTIONS = {
    [SUMMARY_TYPES.STUDY_NOTES]: 'Organized notes for studying and revision',
    [SUMMARY_TYPES.CONCEPT_OVERVIEW]: 'Clear explanation of main concepts',
    [SUMMARY_TYPES.KEY_TAKEAWAYS]: 'Essential points to remember',
    [SUMMARY_TYPES.EXECUTIVE_SUMMARY]: 'Brief overview for quick understanding'
  };
  
  /**
   * Get a display name for a summary length
   * @param {string} length - The summary length code
   * @returns {string} Human-readable length name
   */
  export const getSummaryLengthName = (length) => {
    switch (length) {
      case SUMMARY_LENGTHS.SHORT:
        return 'Short';
      case SUMMARY_LENGTHS.MEDIUM:
        return 'Medium';
      case SUMMARY_LENGTHS.LONG:
        return 'Long';
      default:
        return 'Custom';
    }
  };