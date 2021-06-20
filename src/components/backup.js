footerborderDragFunc() {
    var footerSection = document.getElementsByClassName("resizableFooter")[0]; // element to make resizable

    // Footer resizer div

    var footerResizer = document.createElement("div");
    footerResizer.className = "resizer";
    footerResizer.style.height = "10px";
    footerSection.appendChild(footerResizer);
    footerResizer.addEventListener("mousedown", initDrag, false);

    var startYFooter, startHeightFooter;

    function initDrag(e) {
      startYFooter = e.clientY;
      startHeightFooter = parseInt(
        document.defaultView.getComputedStyle.height,
        10
      );
      document.documentElement.addEventListener("mousemove", doDrag, false);
      document.documentElement.addEventListener("mouseup", stopDrag, false);
    }

    function doDrag(e) {
      footerSection.style.height =
        startHeightFooter + e.clientY - startYFooter + "px";
    }

    function stopDrag(e) {
      document.documentElement.removeEventListener(
        "mousemove",
        doDrag,
        false
      );
      document.documentElement.removeEventListener(
        "mouseup",
        stopDrag,
        false
      );
    }
  },
  headerborderDragFunc() {
    var headerSection = document.getElementsByClassName("resizableHeader")[0]; // element to make resizable

    // Header resizer div

    var headerResizer = document.createElement("div");
    headerResizer.className = "resizer";
    headerResizer.style.height = "10px";
    headerSection.appendChild(headerResizer);
    headerResizer.addEventListener("mousedown", initDrag, false);

    var startYHeader, startHeightHeader;

    function initDrag(e) {
      startYHeader = e.clientY;
      startHeightHeader = parseInt(
        document.defaultView.getComputedStyle.height,
        10
      );
      document.documentElement.addEventListener("mousemove", doDrag, false);
      document.documentElement.addEventListener("mouseup", stopDrag, false);
    }

    function doDrag(e) {
      headerSection.style.height =
        startHeightHeader + e.clientY - startYHeader + "px";
    }

    function stopDrag(e) {
      document.documentElement.removeEventListener(
        "mousemove",
        doDrag,
        false
      );
      document.documentElement.removeEventListener(
        "mouseup",
        stopDrag,
        false
      );
    }