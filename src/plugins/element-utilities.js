function resizable(element, resizableAreas) {
    const resizers = document.getElementsByClassName('elem-resizer')

    for (let resizer of resizers) {
        resizer.onmousedown = (e) => initDrag(e, resizer)
    }

    element.onmousedown = dragable
    var startX, startY, startWidth, startHeight
    function initDrag(e, resizer) {
        if (e.target.className.includes('elem-resizer')) { // If Clicking on the resizer
            startX = e.clientX
            startY = e.clientY
            startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10)
            startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10)
            document.onmousemove = (e) => doDrag(e, resizer)
            document.onmouseup = stopDrag
        }
    }
    function doDrag(e, resizer) {
        var elementREC = element.getBoundingClientRect()
        console.log(elementREC)
        if (resizer.className.includes('right'))
            element.style.width = startWidth + e.clientX - startX + "px"

        if (resizer.className.includes('top')) {
            var newTop = elementREC.height + startHeight + 'px'
            element.style.height = startHeight + newTop - startY + "px"
            element.style.top = newTop + "px"
        }

        if (resizer.className.includes('bottom'))
            element.style.height = startHeight + e.clientY - startY + "px"

        if (resizer.className.includes('br')) {
            element.style.width = startWidth + e.clientX - startX + "px"
            element.style.height = startHeight + e.clientY - startY + "px"
        }

        if (resizer.className.includes('tr')) {
            element.style.width = startWidth + e.clientX - startX + "px"
            element.style.height = startY + startHeight - e.clientY + "px"
        }
    }

    function stopDrag(e) {
        document.onmousemove = null
        document.onmouseup = null
        element.dispatchEvent(new Event("finishededitingelement"))
    }
}

function click(element) {
    element.addEventListener("mousedown", onClick, false)
    function onClick() {
        let selectedElements = document.getElementsByClassName('element selected')
        for (let index = 0; index < selectedElements.length; index++) {
            selectedElements[index].classList.remove('selected')
        }
        element.classList.add('selected')
    }

}

function dragable(element, classType) {

    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0

    // move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown

    function dragMouseDown(e) {
        if (
            e.target.className.includes('element') ||
            e.target.offsetParent.className.includes('element') &&
            e.target.className === 'image') { // if dragging element or image element/variable
            e = e || window.event
            e.preventDefault()
            // get the mouse cursor position at startup:
            pos3 = e.clientX
            pos4 = e.clientY
            document.onmouseup = closeDragElement
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag
        }

        function elementDrag(e) {
            e = e || window.event
            e.preventDefault()
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX
            pos2 = pos4 - e.clientY
            pos3 = e.clientX
            pos4 = e.clientY
            // set the element's new position:
            element.style.top = element.offsetTop - pos2 + "px"
            element.style.left = element.offsetLeft - pos1 + "px"
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null
            document.onmousemove = null
            element.dispatchEvent(new Event("finishededitingelement"))
        }
    }
}
export default {
    resizable,
    dragable,
    click
}