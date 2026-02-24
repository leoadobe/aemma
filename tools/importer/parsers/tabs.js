/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs block
 *
 * Source: https://www.tim.com.br/para-voce/cobertura-e-roaming/5g
 * Base Block: tabs
 *
 * Handles two tab patterns found on TIM pages:
 * 1. Device compatibility tabs (div.scroll-card.modulo-31-scroll-de-card) - Apple/Samsung/Motorola
 * 2. Activation guide tabs (div.scroll-card.m66-tab-horizontal) - iOS/Android
 *
 * Block Structure (from block library example):
 * - Each row: [tab label] | [tab content]
 *
 * Source HTML Pattern:
 * tim-tab-horizontal
 *   > nav.tim-tab-horizontal__nav > div.tim-tab-horizontal__nav__headings
 *     > button.tim-tab-horizontal-heading (tab labels)
 *   > tim-tab (tab content panels)
 *
 * Generated: 2026-02-24
 */
export default function parse(element, { document }) {
  const cells = [];

  // Find the tab component
  // VALIDATED: Found tim-tab-horizontal inside both scroll-card variants in captured DOM
  const tabComponent = element.querySelector('tim-tab-horizontal');

  if (tabComponent) {
    // Extract tab headings
    // VALIDATED: Found button.tim-tab-horizontal-heading in tim-tab-horizontal__nav__headings
    const tabButtons = Array.from(
      tabComponent.querySelectorAll('button.tim-tab-horizontal-heading')
    );

    // Extract tab content panels
    // VALIDATED: Found tim-tab elements as direct children of tim-tab-horizontal
    const tabPanels = Array.from(tabComponent.querySelectorAll(':scope > tim-tab'));

    // Match each tab heading with its content panel
    tabButtons.forEach((button, index) => {
      const label = button.textContent.trim();

      // Create label cell
      const labelEl = document.createElement('p');
      labelEl.textContent = label;

      // Get corresponding panel content
      const panel = tabPanels[index];
      const contentCell = [];

      if (panel) {
        // Extract all meaningful content from the panel
        // For device tables: tim-ecommerce-item with product info
        // For activation: scroll-text-imagem with step-by-step instructions

        // Try device compatibility content
        // VALIDATED: Found tim-ecommerce-item inside tim-tab in modulo-31 variant
        const ecommerceItems = panel.querySelectorAll('tim-ecommerce-item');

        if (ecommerceItems.length > 0) {
          // Device compatibility tab - extract product info
          ecommerceItems.forEach((item) => {
            const itemImg = item.querySelector('img');
            const itemTitle = item.querySelector('h3, .title, [class*="title"]');
            const itemPrice = item.querySelector('tim-price, [class*="price"]');

            if (itemImg) contentCell.push(itemImg);
            if (itemTitle) contentCell.push(itemTitle);
            if (itemPrice) {
              const priceText = document.createElement('p');
              priceText.textContent = itemPrice.textContent.trim();
              contentCell.push(priceText);
            }
          });
        }

        // Try vertical tab with 5G compatibility table
        // VALIDATED: Found table.tabela-5g inside tim-tab-vertical in captured DOM
        const compatTable = panel.querySelector('table.tabela-5g');
        if (compatTable) {
          contentCell.push(compatTable);
        }

        // Try activation step-by-step content
        // VALIDATED: Found div.scroll-text-imagem inside tim-tab in m66 variant
        const steps = panel.querySelectorAll('.scroll-text-imagem, [class*="passo"]');
        if (steps.length > 0) {
          steps.forEach((step) => {
            const stepTitle = step.querySelector('.title, h3, p.coh-heading.title');
            const stepImg = step.querySelector('img.slide-image, tim-carousel-hero img, img');
            if (stepTitle) contentCell.push(stepTitle);
            if (stepImg) contentCell.push(stepImg);
          });
        }

        // Fallback: grab all content from panel
        if (contentCell.length === 0) {
          const allContent = panel.querySelectorAll('h2, h3, p, img, a, ul, ol, table');
          allContent.forEach((el) => contentCell.push(el));
        }
      }

      // Add row: [tab label] | [tab content]
      cells.push([labelEl, contentCell.length > 0 ? contentCell : '']);
    });
  }

  // Fallback: If no tim-tab-horizontal found, try vertical tabs
  // VALIDATED: Found tim-tab-vertical in captured DOM
  if (cells.length === 0) {
    const verticalTab = element.querySelector('tim-tab-vertical');
    if (verticalTab) {
      const vButtons = Array.from(
        verticalTab.querySelectorAll('button.tim-tab-vertical-heading')
      );
      const vPanels = Array.from(verticalTab.querySelectorAll('div.tim-tab-vertical__content > div'));

      vButtons.forEach((button, index) => {
        const labelEl = document.createElement('p');
        labelEl.textContent = button.textContent.trim();

        const panel = vPanels[index];
        const contentCell = [];
        if (panel) {
          const table = panel.querySelector('table');
          if (table) {
            contentCell.push(table);
          } else {
            const allContent = panel.querySelectorAll('h2, h3, p, img, a');
            allContent.forEach((el) => contentCell.push(el));
          }
        }

        cells.push([labelEl, contentCell.length > 0 ? contentCell : '']);
      });
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Tabs', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
