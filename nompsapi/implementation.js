class MessagePane {
  constructor() {
    this.attachedWindows = {};
  }

  attachToWindow(windowId, window) {
    let current3Pane = window.gTabmail.tabInfo.find(
      t => t.mode.name == "mail3PaneTab"
    ).chromeBrowser.contentWindow;

    let threadTreeHeader = current3Pane.threadTree.table.header;

    threadTreeHeader.addEventListener('click',
                                      this.columnClicked,
                                      true);

    this.attachedWindows[windowId] = window;
  }

  detachFromWindow(windowId) {
    var window = this.attachedWindows[windowId];

    if(window) {
      let current3Pane = window.gTabmail.tabInfo.find(
        t => t.mode.name == "mail3PaneTab"
      ).chromeBrowser.contentWindow;

      let threadTreeHeader = current3Pane.threadTree.table.header;

      threadTreeHeader.removeEventListener('click',
                                           this.columnClicked,
                                           true);
      delete this.attachedWindows[windowId];
    }
  }

  detachFromAllWindows() {
    for(var windowId in this.attachedWindows) {
      this.detachFromWindow(windowId);
    }
  }

  columnClicked(event) {
    // Swallow the click event and prevent propagation if the click
    // targeted a treecol header.
    //
    // Process click event if ctrl-click was used
    var target = event.originalTarget;

    if(event.ctrlKey == false &&
       event.altKey == false &&
       event.metaKey == false) {
      event.stopPropagation();
    }
  }
}

const messagePane = new MessagePane();

var nompsApi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {

    context.callOnClose(this);

    return {
      nompsApi: {
        async initNoMpSort(windowId) {
          let window =
              context.extension.windowManager.get(windowId, context).window;

          messagePane.attachToWindow(windowId, window);
        },

        async terminateNoMpSort(windowId) {
          messagePane.detachFromWindow(windowId);
        }
      }
    }
  }

  close() {
    messagePane.detachFromAllWindows();
  }
};
