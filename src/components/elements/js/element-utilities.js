/**
 * Making the elements resizable
 */

function resizable(element) {
    var resizer = document.createElement("div");
    resizer.className = "resizer";
    element.appendChild(resizer);
    resizer.addEventListener("mousedown", initDrag, false);
    element.addEventListener("mousedown", dragable, false);

    var startX, startY, startWidth, startHeight;

    function initDrag(e) {
        if (e.target.className === 'resizer') {
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(
                document.defaultView.getComputedStyle(element).width,
                10
            );
            startHeight = parseInt(
                document.defaultView.getComputedStyle(element).height,
                10
            );
            document.documentElement.addEventListener("mousemove", doDrag, false);
            document.documentElement.addEventListener("mouseup", stopDrag, false);
        }
    }
    function doDrag(e) {
        element.style.width = startWidth + e.clientX - startX + "px";
        element.style.height = startHeight + e.clientY - startY + "px";
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
}

/**
 * borders and resizer preview on selected
 */

function click(element, classType) {
    element.addEventListener("mousedown", onClick, false);
    function onClick() {
        console.log(element.lastChild);
        let selectedElements = document.getElementsByClassName('element selected');
        for (let index = 0; index < selectedElements.length; index++) {
            selectedElements[index].className = classType + " element";
        }
        if (element.lastChild.className != 'resizer') {
            resizable(element)
        }
        element.className = classType + " element selected";
    }

}

/**
 * Making elements draggable
 */

function dragable(element, classType) {

    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    // move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (
            e.target.className === `${classType} element` || e.target.className === `${classType} element selected`
        ) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = element.offsetTop - pos2 + "px";
            element.style.left = element.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}
export default {
    resizable,
    dragable,
    click
}