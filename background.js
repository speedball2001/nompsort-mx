class NoMpSort {
  constructor() {}

  async run() {
    // Initialize UI in all open windows.
    let tabs = await browser.tabs.query({mailTab: true});
    for (let tab of tabs) {
      this.initUI(tab);
    }

    // Listen to new tabs create events to init their UI.
    browser.tabs.onCreated.addListener((tab) => this.initUI(tab));

    // Listen to tabs close events to terminate nompsort for that tab
    // (the api does some bookkeeping and we don't want to leak memory).
    browser.tabs.onRemoved.addListener((tabId) => this.terminateUI(tabId));
  }

  async initUI(tab) {
    if(tab.mailTab) {
      browser.nompsApi.initNoMpSort(tab.id);
    }
  }

  async terminateUI(tabId) {
    browser.nompsApi.terminateNoMpSort(tabId);
  }
}

const nompsort = new NoMpSort();
nompsort.run();
