/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.tim.com.br/para-voce/cobertura-e-roaming/5g
 * Base Block: columns
 *
 * Handles two column patterns found on TIM pages:
 * 1. Impact areas (div.accordion-vertical-image) - image + accordion list of impact areas
 * 2. Turbo package (div.conjunto-img-txt) - image + text/pricing content
 *
 * Block Structure (from block library example):
 * - Each row: [column 1 content] | [column 2 content]
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Accordion vertical image (impact areas)
  // VALIDATED: Found div.accordion-vertical-image with intro-area, image-holder, accordion-section
  const imageHolder = element.querySelector('.accordion-vertical-image-holder img') ||
                      element.querySelector('tim-photo-container img');
  const accordionSection = element.querySelector('.accordion-section');

  if (imageHolder && accordionSection) {
    // Column 1: Heading + image
    const introTitle = element.querySelector('.intro-area .title') ||
                       element.querySelector('.intro-area h2') ||
                       element.querySelector('p.coh-heading.title');
    const titlePrefix = element.querySelector('.intro-area .title-prefix') ||
                        element.querySelector('p.coh-heading.title-prefix');

    const col1 = [];
    if (titlePrefix) col1.push(titlePrefix);
    if (introTitle) col1.push(introTitle);
    col1.push(imageHolder);

    // Column 2: Accordion items as list
    // VALIDATED: Found div.accordion-item with accordion-header > h3 in captured DOM
    const accordionItems = Array.from(accordionSection.querySelectorAll('.accordion-item'));
    const col2 = [];

    accordionItems.forEach((item) => {
      const itemHeading = item.querySelector('.accordion-header h3') ||
                          item.querySelector('h3');
      const itemContent = item.querySelector('.accordion-body .content-area') ||
                          item.querySelector('.accordion-body');
      if (itemHeading) col2.push(itemHeading);
      if (itemContent) col2.push(itemContent);
    });

    cells.push([col1, col2]);
  }

  // Pattern 2: Conjunto img-txt (turbo package)
  // VALIDATED: Found div.conjunto-img-txt with content-area.txt-img-region and img-area
  if (cells.length === 0) {
    const textArea = element.querySelector('.content-area.txt-img-region') ||
                     element.querySelector('.content-area');
    const imgArea = element.querySelector('.img-area');

    if (textArea || imgArea) {
      // Column 1: Image
      const productImg = imgArea?.querySelector('tim-photo-container img') ||
                         imgArea?.querySelector('img') ||
                         element.querySelector('.img-area img');

      // Column 2: Text content (title, subtitle, description, price, CTA)
      // VALIDATED: Found h2.title-prefix, h3.title, p.text-content, tim-button in captured DOM
      const titlePrefix = textArea?.querySelector('h2.coh-heading.title-prefix') ||
                          textArea?.querySelector('.title-prefix');
      const title = textArea?.querySelector('h3.coh-heading.title') ||
                    textArea?.querySelector('h3') ||
                    textArea?.querySelector('.title');
      const description = textArea?.querySelector('p.coh-heading.text-content') ||
                          textArea?.querySelector('.text-content');

      // Extract price image
      // VALIDATED: Found img with alt containing price text in captured DOM
      const priceImg = textArea?.querySelector('img[alt*="R$"]') ||
                       textArea?.querySelector('.container-m13-2-desktop img');

      // Extract CTA
      const cta = textArea?.querySelector('tim-button a') ||
                  textArea?.querySelector('a[href]');

      const col1 = [];
      if (productImg) col1.push(productImg);

      const col2 = [];
      if (titlePrefix) col2.push(titlePrefix);
      if (title) col2.push(title);
      if (description) col2.push(description);
      if (priceImg) col2.push(priceImg);
      if (cta) col2.push(cta);

      cells.push([col1.length > 0 ? col1 : '', col2]);
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
