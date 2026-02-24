/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-journey block (journey/timeline cards with images)
 *
 * Source: https://www.tim.com.br/para-voce/cobertura-e-roaming/5g
 * Base Block: cards
 *
 * Block Structure (from block library example):
 * - Each row: [image cell] | [text content cell (title, description, CTA)]
 *
 * Source HTML Pattern:
 * div.carrossel-conteudo
 *   > tim-carousel-article
 *     > tim-carousel-article-content (individual cards)
 *       > article > header > img (card image)
 *       > p.image-subtitle (category)
 *       > h3.title (card title)
 *       > p.text (card description)
 *       > footer > div.link-area > a.coh-link (CTA)
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find carousel article content cards
  // VALIDATED: Found tim-carousel-article-content inside tim-carousel-article in captured DOM
  let cardElements = Array.from(element.querySelectorAll('tim-carousel-article-content'));

  // Fallback: try article elements
  if (cardElements.length === 0) {
    cardElements = Array.from(element.querySelectorAll('article'));
  }

  // Fallback: try card-conteudo class
  if (cardElements.length === 0) {
    cardElements = Array.from(element.querySelectorAll('.card-conteudo'));
  }

  cardElements.forEach((card) => {
    // Extract image
    // VALIDATED: Found img.tim-carousel-article-content-image-clicker in article > header
    const img = card.querySelector('img.tim-carousel-article-content-image-clicker') ||
                card.querySelector('article > header > img') ||
                card.querySelector('img');

    // Extract title
    // VALIDATED: Found h3.coh-heading.title inside tim-carousel-article-content
    const title = card.querySelector('h3.coh-heading.title') ||
                  card.querySelector('h3.title') ||
                  card.querySelector('h3');

    // Extract subtitle/category
    // VALIDATED: Found p.coh-heading.image-subtitle in captured DOM
    const subtitle = card.querySelector('p.coh-heading.image-subtitle') ||
                     card.querySelector('p.image-subtitle');

    // Extract description
    // VALIDATED: Found p.coh-heading.text in captured DOM
    const description = card.querySelector('p.coh-heading.text') ||
                        card.querySelector('p.text');

    // Extract CTA link
    // VALIDATED: Found a.coh-link.tim-button-textlink in footer > div.link-area
    const ctaLink = card.querySelector('.link-area a.coh-link') ||
                    card.querySelector('footer a') ||
                    card.querySelector('a[href]');

    // Build image cell
    const imageCell = [];
    if (img) imageCell.push(img);

    // Build text content cell
    const textCell = [];
    if (subtitle) textCell.push(subtitle);
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (ctaLink) textCell.push(ctaLink);

    // Add row: [image] | [text content]
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', textCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
