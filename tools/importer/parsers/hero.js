/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.tim.com.br/para-voce/cobertura-e-roaming/5g
 * Base Block: hero
 *
 * Block Structure (from block library example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, subheading, CTAs)
 *
 * Source HTML Pattern:
 * div.hero-carrossel.hero-destaque.hero-destaque-full-image
 *   > div.hero-destaque-carrossel__grid
 *     > div.header-wrapper > div.title-prefix > .coh-wysiwyg h1
 *     > div.title .coh-wysiwyg p (subtitle)
 *     > ul.button-wrapper__desktop > li > tim-button > button/a (CTAs)
 *   > img (background image)
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  // Extract background image
  // VALIDATED: Found img as direct/near-direct child of div.hero-carrossel
  const bgImage = element.querySelector('img');

  // Extract heading
  // VALIDATED: Found h1 inside div.title-prefix > .coh-wysiwyg in captured DOM
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('.title-prefix .coh-wysiwyg h1');

  // Extract subtitle
  // VALIDATED: Found p inside div.title .coh-wysiwyg in captured DOM
  const subtitle = element.querySelector('.title .coh-wysiwyg p') ||
                   element.querySelector('.coh-wysiwyg.title p') ||
                   element.querySelector('p.coh-heading');

  // Extract CTA buttons from desktop wrapper
  // VALIDATED: Found ul.button-wrapper__desktop > li > tim-button in captured DOM
  const ctaContainer = element.querySelector('ul.button-wrapper__desktop') ||
                       element.querySelector('ul.button-wrapper__mobile');
  let ctas = [];
  if (ctaContainer) {
    // Get all links/buttons within the CTA container
    ctas = Array.from(ctaContainer.querySelectorAll('a[href], tim-button a'));
    if (ctas.length === 0) {
      // Fallback: try to find button text and create links
      const buttons = Array.from(ctaContainer.querySelectorAll('tim-button, button'));
      ctas = buttons.map((btn) => {
        const link = document.createElement('a');
        link.textContent = btn.textContent.trim();
        const href = btn.getAttribute('href') || btn.closest('a')?.getAttribute('href') || '#';
        link.href = href;
        return link;
      });
    }
  }

  // Build cells array matching hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading, subtitle, CTAs in single cell)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);
  contentCell.push(...ctas);
  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
