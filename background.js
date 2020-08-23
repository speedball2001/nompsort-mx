class NoMpSort {
  constructor() {

  }

  run() {
    console.log("NoMpSort#run");

    //
    // initialize UI of all open windows
    browser.windows.getCurrent().then((window) => this.initUI(window));

    //
    // listen to new window create events to init their UI
    browser.windows.onCreated.addListener((window) => this.initUI(window));
  }

  async initUI(window) {
    if(window.type == "normal") {
      browser.nompsApi.initNoMpSort(window.id);;
    }
  }
}

const nompsort = new NoMpSort();
nompsort.run();
