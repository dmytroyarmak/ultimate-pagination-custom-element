// import { getPaginationModel } from 'ultimate-pagination';

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
    this.innerHTML = `
      <pre>Current page: ${this.currentPage}</pre>
      <pre>Total pages: ${this.totalPages}</pre>
    `;
  }
}

window.customElements.define('ultimate-pagination', UltimatePagination);
