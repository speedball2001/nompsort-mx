class MessagePane {
  constructor(messagePaneId) {
    this.messagePaneId = messagePaneId;
    this.attachedWindows = {};
  }

  attachToWindow(windowId, window) {
    console.log(`MessagePane#attachToWindow: ${windowId}, ${window}`);
    console.log(window.document.getElementById(this.messagePaneId));

    var messagePaneElement =
      window.document.getElementById(this.messagePaneId);

    const listener = (event) => this.columnClicked;
    messagePaneElement.addEventListener('click',
                                        this.columnClicked,
                                        true);

    this.attachedWindows[windowId] = window;
  }

  detachFromWindow(windowId) {
    console.log(`MessagePane#detachFromWindow - start: ${this.attachedWindows}`);
    var window = this.attachedWindows[windowId];
    var messagePaneElement =
        window.document.getElementById(this.messagePaneId);

    messagePaneElement.removeEventListener('click',
                                           this.columnClicked,
                                           true);

    delete this.attachedWindows[windowId];

    console.log(`MessagePane#detachFromWindow - end: ${this.attachedWindows}`);
  }

  detachFromAllWindows() {
    for(var windowId in this.attachedWindows) {
      this.detachFromWindow(windowId);
    }
  }

  columnClicked(event) {
    console.log("MessagePane#columnClicked");
    // Swallow the click event and prevent propagation if the click
    // targeted a treecol header.
    //
    // Process click event if ctrl-click was used
    var target = event.originalTarget;
    if(target.localName == "treecol" &&
       (event.ctrlKey == false &&
        event.altKey == false &&
        event.metaKey == false)) {
      console.log("MessagePane#columnClicked: stop propagation");
      event.stopPropagation();
    }
  }
}

const messagePane = new MessagePane("threadPaneBox");

var nompsApi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {

    context.callOnClose(this);

    return {
      nompsApi: {
        async initNoMpSort(windowId) {
          console.log(`nompsApi.initNoMpSort: ${windowId}`);
          let window = context.extension.windowManager.get(windowId, context).window;

          messagePane.attachToWindow(windowId, window);
        },

        async terminateNoMpSort(windowId) {
          console.log(`nompsApi.terminateNoMpSort: ${windowId}`);

          messagePane.detachFromWindow(windowId);
        }
      }
    }
  }


  close() {
    messagePane.detachFromAllWindows();
  }
};
