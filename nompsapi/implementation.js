class MessagePane {
  constructor() {
    this.attachedTabs = {};
  }

  async attachToTab(tabId, about3Pane) {
    if (about3Pane.document.readyState != "complete") {
      await new Promise(resolve => {
        about3Pane.addEventListener("load", resolve,{ once: true });
      })
    }
    
    let threadTreeHeader = about3Pane.threadTree.table.header;
    threadTreeHeader.addEventListener(
      'click',
      this.columnClicked,
      true
    );

    this.attachedTabs[tabId] = about3Pane;
  }

  detachFromTab(tabId) {
    var about3Pane = this.attachedTabs[tabId];

    if (about3Pane) {
      let threadTreeHeader = about3Pane.threadTree.table.header;
      threadTreeHeader.removeEventListener(
        'click',
        this.columnClicked,
        true
      );

      delete this.attachedTabs[tabId];
    }
  }

  detachFromAllTabs() {
    for (var tabId in this.attachedTabs) {
      this.detachFromTab(tabId);
    }
  }

  columnClicked(event) {
    // Swallow the click event and prevent propagation if the click
    // targeted a treecol header.
    //
    // Process click event if ctrl-click was used
    var target = event.originalTarget;

    // The column selector should always respond to clicks
    if (target.closest(".button-column-picker") != null) {
      return;
    }

    if (event.ctrlKey == false &&
      event.altKey == false &&
      event.metaKey == false) {
      event.stopPropagation();
    }
  }
}

const messagePane = new MessagePane();

var nompsApi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    function getAbout3Pane(tabId) {
      // Get about:3pane from the tabId.
      let { nativeTab } = context.extension.tabManager.get(tabId);
      if (nativeTab instanceof Ci.nsIDOMWindow && nativeTab.document.documentElement.getAttribute("windowtype") == "mail:3pane") {
        return nativeTab.gTabmail.currentAbout3Pane
      } else if (nativeTab.mode && nativeTab.mode.name == "mail3PaneTab") {
        return nativeTab.chromeBrowser.contentWindow
      }
      return null;
    }

    return {
      nompsApi: {
        async initNoMpSort(tabId) {
          let window = getAbout3Pane(tabId);
          messagePane.attachToTab(tabId, window);
        },

        async terminateNoMpSort(tabId) {
          messagePane.detachFromTab(tabId);
        }
      }
    }
  }

  onShutdown() {
    messagePane.detachFromAllTabs();
  }
};
