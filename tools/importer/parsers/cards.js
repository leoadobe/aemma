/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.tim.com.br/para-voce/cobertura-e-roaming/5g
 * Base Block: cards
 *
 * Handles two card patterns found on TIM pages:
 * 1. Icon cards (div.horizontal-list-image) - cards with icon + title + description
 * 2. Benefit/feature cards (div.lista-vertical-descricao-links) - cards with icon + title + description
 *
 * Block Structure (from block library example):
 * - Each row: [image/icon cell] | [text content cell (title, description, CTA)]
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Icon cards (horizontal-list-image)
  // VALIDATED: Found div.card-simple inside div.horizontal-list-image in captured DOM
  let cardElements = Array.from(element.querySelectorAll('div.card-simple'));

  // Pattern 2: Benefit/feature cards (lista-vertical-descricao-links)
  // VALIDATED: Found div.card-item inside div.lista-vertical-descricao-links in captured DOM
  if (cardElements.length === 0) {
    cardElements = Array.from(element.querySelectorAll('div.card-item'));
  }

  // Fallback: try generic ssa-component containers
  if (cardElements.length === 0) {
    cardElements = Array.from(element.querySelectorAll('.ssa-component[class*="card"]'));
  }

  cardElements.forEach((card) => {
    // Extract icon/image for first cell
    // VALIDATED: Found tim-icon.icon inside card elements in captured DOM
    const icon = card.querySelector('tim-icon.icon');
    const img = card.querySelector('img');

    // Build icon/image cell
    const iconCell = [];
    if (img) {
      iconCell.push(img);
    } else if (icon) {
      // Extract icon class name for reference
      const iconText = document.createElement('span');
      const iconClass = Array.from(icon.classList).find((cls) => cls.startsWith('icon-')) || '';
      iconText.textContent = `:${iconClass}:`;
      iconCell.push(iconText);
    }

    // Extract text content for second cell
    // VALIDATED: Found h3.coh-heading (title) and p.coh-heading (description) in card-simple
    // VALIDATED: Found h3 strong (title) and .lista-item-descricao p (description) in card-item
    const title = card.querySelector('h3') ||
                  card.querySelector('[class*="title"]') ||
                  card.querySelector('.coh-heading');

    const description = card.querySelector('.lista-item-descricao .coh-wysiwyg p') ||
                        card.querySelector('p.coh-heading') ||
                        card.querySelector('p');

    // Extract CTA link if present
    // VALIDATED: Found div.link-area > a.coh-link in card-simple
    const ctaLink = card.querySelector('.link-area a.coh-link') ||
                    card.querySelector('a.coh-link') ||
                    card.querySelector('a[href]');

    // Build text content cell
    const textCell = [];
    if (title) textCell.push(title);
    if (description && description !== title) textCell.push(description);
    if (ctaLink) textCell.push(ctaLink);

    // Add row: [icon/image] | [text content]
    if (iconCell.length > 0 || textCell.length > 0) {
      cells.push([iconCell.length > 0 ? iconCell : '', textCell]);
    }
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
