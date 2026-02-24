/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block (FAQ section)
 *
 * Source: https://www.tim.com.br/para-voce/cobertura-e-roaming/5g
 * Base Block: accordion
 *
 * Block Structure (from block library example):
 * - Each row: [question/title cell] | [answer/content cell]
 *
 * Source HTML Pattern:
 * div.faq-container
 *   > div.faq-column-right
 *     > div.accordion
 *       > div.faq-view
 *         > div.views-row
 *           > article.accordion-item
 *             > div.accordion-header-row > p.title.text-m8-faq (question)
 *             > div.accordion-body > div.field-description (answer)
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find FAQ accordion items
  // VALIDATED: Found article.accordion-item inside div.accordion in captured DOM
  let faqItems = Array.from(element.querySelectorAll('article.accordion-item'));

  // Fallback: try views-row containers
  if (faqItems.length === 0) {
    faqItems = Array.from(element.querySelectorAll('.views-row'));
  }

  // Fallback: try generic accordion item pattern
  if (faqItems.length === 0) {
    faqItems = Array.from(element.querySelectorAll('.accordion-item'));
  }

  faqItems.forEach((item) => {
    // Extract question
    // VALIDATED: Found p.title.text-m8-faq inside div.accordion-header-row in captured DOM
    const question = item.querySelector('p.title.text-m8-faq') ||
                     item.querySelector('.accordion-header-row p.title') ||
                     item.querySelector('.accordion-header p') ||
                     item.querySelector('h3, h4, summary');

    // Extract answer
    // VALIDATED: Found div.field-description inside div.accordion-body in captured DOM
    const answer = item.querySelector('.accordion-body .field-description') ||
                   item.querySelector('.accordion-body') ||
                   item.querySelector('.accordion-content');

    if (question || answer) {
      // Build question cell
      const questionCell = [];
      if (question) {
        questionCell.push(question);
      }

      // Build answer cell
      const answerCell = [];
      if (answer) {
        // Get all child content from the answer container
        const answerChildren = answer.querySelectorAll('p, ul, ol, a, img, h3, h4, div');
        if (answerChildren.length > 0) {
          answerChildren.forEach((child) => {
            // Skip empty elements
            if (child.textContent.trim() || child.tagName === 'IMG') {
              answerCell.push(child);
            }
          });
        }
        // Fallback: use the answer element directly if no children found
        if (answerCell.length === 0) {
          answerCell.push(answer);
        }
      }

      // Add row: [question] | [answer]
      cells.push([questionCell, answerCell.length > 0 ? answerCell : '']);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
