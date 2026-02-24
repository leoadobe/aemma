/**
 * Metadata Block
 * Metadata is extracted during page decoration and applied to the document head.
 * This block hides itself from display.
 * @param {Element} block The metadata block element
 */
export default function decorate(block) {
  block.closest('.section').remove();
}
