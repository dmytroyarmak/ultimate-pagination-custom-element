import { html, render } from 'lit-html/lib/lit-extended';
import { getPaginationModel, ITEM_TYPES } from 'ultimate-pagination';

const itemTypeToButtonTextMap = {
  [ITEM_TYPES.ELLIPSIS]: '...',
  [ITEM_TYPES.FIRST_PAGE_LINK]: 'First',
  [ITEM_TYPES.PREVIOUS_PAGE_LINK]: 'Prev',
  [ITEM_TYPES.NEXT_PAGE_LINK]: 'Next',
  [ITEM_TYPES.LAST_PAGE_LINK]: 'Last',
};

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

    render(html`
      <div>
        ${items.map((item) => this.renderItem(item))}
      </div>
    `, this);
  }

  renderItem(item) {
    const isBold = item.type === ITEM_TYPES.PAGE && item.isActive;
    return html`
      <button
        style$="font-size: ${10}px; ${ isBold ? 'font-weight: bold' : '' }"
        on-click=${()=> this.onClickButton(item)}
      >${this.getButtonText(item)}</button>
    `;
  }

  onClickButton(item) {
    if (!item.isActive) {
      this.currentPage = item.value;
    }
  }

  getButtonText(item) {
    return itemTypeToButtonTextMap[item.type] || item.value;
  }
}

window.customElements.define('ultimate-pagination', UltimatePagination);
