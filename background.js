class NoMpSort {
  constructor() {

  }

  run() {
    //
    // initialize UI of all open windows
    browser.windows.getCurrent().then((window) => this.initUI(window));

    //
    // listen to new window create events to init their UI
    browser.windows.onCreated.addListener((window) => this.initUI(window));

    // listen to window close events to terminate nompsort for that window
    // (the api does some bookkeeping and we don't want to leak memory)
    browser.windows.onRemoved.addListener((windowId) => this.terminateUI(windowId));
  }

  async initUI(window) {
    if(window.type == "normal") {
      browser.nompsApi.initNoMpSort(window.id);;
    }
  }

  async terminateUI(windowId) {
    browser.nompsApi.terminateNoMpSort(windowId);
  }
}

const nompsort = new NoMpSort();
nompsort.run();
