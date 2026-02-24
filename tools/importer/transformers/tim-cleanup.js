/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for TIM Brazil website cleanup
 * Purpose: Remove non-content elements, cookie banners, modals, tracking, and fix DOM issues
 * Applies to: www.tim.com.br (all templates)
 * Tested: /para-voce/cobertura-e-roaming/5g
 * Generated: 2026-02-24
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banners
    // EXTRACTED: Found div.cc-window.cc-banner cookie consent in captured DOM (lines 2-22)
    // EXTRACTED: Found div#block-cookiesui / div#cookiesjsr cookie consent in captured DOM (lines 4787-4810)
    WebImporter.DOMUtils.remove(element, [
      'div.cc-window.cc-banner',
      'div.cc-revoke',
      'div.cmp-loader',
      '#block-cookiesui',
      '#cookiesjsr',
      '.cookiesjsr--app',
    ]);

    // Remove modals and overlays
    // EXTRACTED: Found div.coh-modal.ssa-component.a11y-modal with IDs:
    // modal-aparelhos1, modal-datas, modapple, modsamsung, modmotorola, modal-passo-a-passo
    WebImporter.DOMUtils.remove(element, [
      'div.coh-modal.a11y-modal',
      'div.coh-modal-overlay',
      'tim-modal#acessibility-modal',
    ]);

    // Remove floating bar
    // EXTRACTED: Found div.coh-container.floating-bar in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'div.floating-bar',
    ]);

    // Remove header and footer (handled separately in EDS)
    // EXTRACTED: Found header and footer#page-footer in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer#page-footer',
    ]);

    // Remove accessibility/skip links
    // EXTRACTED: Found ul.accessibility-anchor-links and skip-link elements
    WebImporter.DOMUtils.remove(element, [
      'ul.accessibility-anchor-links',
      'a.visually-hidden.focusable.skip-link',
      'a.keyboard-navigation-blue-portal',
      'a.keyboard-navigation-orange-portal',
    ]);

    // Remove Drupal settings-tray fix blocks (empty script/behavior blocks)
    // EXTRACTED: Found multiple div.settings-tray-editable blocks with timbrasil fix IDs
    WebImporter.DOMUtils.remove(element, [
      'div.settings-tray-editable',
    ]);

    // Remove vitrine/store modal carousel
    // EXTRACTED: Found div.coh-container.vitrine (id 8be4) with tim-carousel-card-offer
    WebImporter.DOMUtils.remove(element, [
      'div.vitrine',
    ]);

    // Remove coverage map iframe
    // EXTRACTED: Found div.cpt_iframe_wrap with iframe to tim.img.com.br/mapa-cobertura
    WebImporter.DOMUtils.remove(element, [
      'div.cpt_iframe_wrap',
    ]);

    // Re-enable scrolling if blocked by modals
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove tracking and analytics elements
    // EXTRACTED: Found div#bysideWebcare_ParseArea, div#iwc_pane, iframe#iwc,
    // div#criteo-tags-div in captured DOM (lines 6013-6032)
    WebImporter.DOMUtils.remove(element, [
      '#bysideWebcare_ParseArea',
      '#iwc_pane',
      'iframe#iwc',
      '#criteo-tags-div',
      'img[src*="secure.adnxs.com"]',
      'img[src*="byside.com"]',
      'img[src*="tailtarget.com"]',
    ]);

    // Remove remaining iframes, noscript, and link elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'source',
    ]);

    // Clean up tracking attributes
    // EXTRACTED: Found onclick and data-track attributes on various elements in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-gtm');
    });
  }
}
