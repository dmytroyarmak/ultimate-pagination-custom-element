import { getPaginationModel, ITEM_TYPES } from 'ultimate-pagination';

class UltimatePagination extends HTMLElement   {
  get currentPage() {
    const currentPageAttribute = this.getAttribute('current-page');
    if (!currentPageAttribute) {
      return 1;
    }
    return parseInt(currentPageAttribute, 10);
  }

  set currentPage(val) {
    this.setAttribute('current-page', val);
  }

  get totalPages() {
    const totalPagesAttribute = this.getAttribute('total-pages');
    return parseInt(totalPagesAttribute, 10);
  }

  set totalPages(val) {
    this.setAttribute('total-pages', val);
  }

  static get observedAttributes() {
    return ['current-page', 'total-pages'];
  }

  attributeChangedCallback() {
    this.invalidate();
  }

  invalidate() {
    if (!this.isRendering) {
      this.isRendering = true;
      Promise.resolve().then(() => {
        this.isRendering = false;
        this.render();
      })
    }
  }

  render() {
    const items = getPaginationModel({
      currentPage: this.currentPage,
      totalPages: this.totalPages
    });

    this.innerHTML = '';
    items
      .map((item) => this.createItemElement(item))
      .forEach((itemElement) => this.appendChild(itemElement));
  }

  createItemElement(item) {
    switch(item.type) {
      case ITEM_TYPES.PAGE: return this.createPageElement(item);
      case ITEM_TYPES.ELLIPSIS: return this.createEllipsisElement(item);
      case ITEM_TYPES.FIRST_PAGE_LINK: return this.createFirstPageLintElement(item);
      case ITEM_TYPES.PREVIOUS_PAGE_LINK: return this.createPreviousPageLinkElement(item);
      case ITEM_TYPES.NEXT_PAGE_LINK: return this.createNextPageLinkElement(item);
      case ITEM_TYPES.LAST_PAGE_LINK: return this.createLastPageLinkElement(item);
      default: throw new Error('Unknown item type');
    }
  }

  createPageElement(item) {
    return this.createButtonElement(item, { boldOnActive: true });
  }

  createEllipsisElement(item) {
    return this.createButtonElement(item, { text: '...' });
  }

  createFirstPageLintElement(item) {
    return this.createButtonElement(item, { text: 'First' });
  }

  createPreviousPageLinkElement(item) {
    return this.createButtonElement(item, { text: 'Prev' });
  }

  createNextPageLinkElement(item) {
    return this.createButtonElement(item, { text: 'Next' });
  }

  createLastPageLinkElement(item) {
    return this.createButtonElement(item, { text: 'Last' });
  }

  createButtonElement(item, { text = item.value, boldOnActive = false} = {}) {
    const itemElement = document.createElement('button');
    itemElement.textContent = text;
    if (item.isActive && boldOnActive) {
      itemElement.style.fontWeight = 'bold';
    }
    if (!item.isActive) {
      itemElement.addEventListener('click', () => this.currentPage = item.value);
    }
    return itemElement;
  }
}

window.customElements.define('ultimate-pagination', UltimatePagination);
