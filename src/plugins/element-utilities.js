class Element {
  constructor(element, resizerQuery) {
    this.element = element
    this.resizerQuery = resizerQuery
  }

  /**
   * make element resiable
   * @emits {size-changed} call size-changed event and passes cleanedCoordinates, element, queryResizer.
   */
  resizable() {
    var element = this.element
    const resizers = document.querySelectorAll(`.elem-resizer.${this.resizerQuery}`)

    for (let resizer of resizers) {
      resizer.onmousedown = (e) => initDrag(e, resizer)
    }

    element.onmousedown = this.dragable
    var startX, startY, startWidth, startHeight, originalLeft, originalTop, that = this
    function initDrag(e, resizer) {
      if (e.target.className.includes('elem-resizer')) { // If Clicking on the resizer
        originalLeft = element.offsetLeft
        originalTop = element.offsetTop
        startX = e.clientX
        startY = e.clientY
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10)
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10)
        document.onmousemove = (e) => doDrag(e, resizer)
        document.onmouseup = stopDrag
      }
    }
    function doDrag(e, resizer) {
      if (resizer.className.includes('right'))
        element.style.width = startWidth + e.clientX - startX + "px"

      else if (resizer.className.includes('top')) {
        element.style.height = startY - (e.clientY - startHeight) + "px"
        element.style.top = originalTop + (e.clientY - startY) + 'px'
      }

      else if (resizer.className.includes('bottom'))
        element.style.height = startHeight + e.clientY - startY + "px"

      else if (resizer.className.includes('left')) {
        element.style.width = startWidth - e.clientX + startX + "px"
        element.style.left = originalLeft + (e.clientX - startX) + 'px'
      }

      else if (resizer.className.includes('br')) {
        element.style.width = startWidth + e.clientX - startX + "px"
        element.style.height = startHeight + e.clientY - startY + "px"
      }

      else if (resizer.className.includes('tr')) {
        element.style.width = startWidth + e.clientX - startX + "px"
        element.style.height = startY - (e.clientY - startHeight) + "px"
        element.style.top = originalTop + (e.clientY - startY) + 'px'
      }

      else if (resizer.className.includes('bl')) {
        element.style.width = startWidth - e.clientX + startX + "px"
        element.style.height = startHeight + e.clientY - startY + "px"
        element.style.left = originalLeft + (e.clientX - startX) + 'px'
      }

      else if (resizer.className.includes('tl')) {
        element.style.height = startY - (e.clientY - startHeight) + "px"
        element.style.width = startWidth - e.clientX + startX + "px"
        element.style.left = originalLeft + (e.clientX - startX) + 'px'
        element.style.top = originalTop + (e.clientY - startY) + 'px'
      }
    }

    function stopDrag(e) {
      document.onmousemove = null
      document.onmouseup = null
      element.dispatchEvent(new Event("finishededitingelement"))
      element.dispatchEvent(
        new CustomEvent('size-changed', {
          detail: {
            oldValue: {
              height: startHeight,
              width: startWidth,
              left: originalLeft,
              top: originalTop,
            },
            newValue: that.cleanedCoordinates(),
            elementDetails: { element: that.element, resizerQuery: that.resizerQuery }
          }
        })
      )
    }
  }

  /**
   * element click handler 
   * @emits {click} call click event and passes element, queryResizer.
   */
  click() {
    var element = this.element
    var that = this
    element.addEventListener("mousedown", onClick, false)
    function onClick() {
      let selectedElements = document.getElementsByClassName('element selected')
      for (let index = 0; index < selectedElements.length; index++) {
        selectedElements[index].classList.remove('selected')
      }
      element.classList.add('selected')
      element.dispatchEvent(
        new CustomEvent('click', {
          detail: {
            elementDetails: { element: that.element, resizerQuery: that.resizerQuery }
          }
        })
      )
    }

  }

  /**
   * make element dragable
   * @emits {drag-end} call drag-end event and passes cleanedCoordinates, element, queryResizer.
   */
  dragable() {
    var element = this.element
    var that = this
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0

    // move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown

    function dragMouseDown(e) {

      if (e.target.className.includes('resizer'))
        return

      if (
        e.target.className.includes('element') || e.target.offsetParent.className.includes('element')) { // if dragging element or image element/variable
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
        element.dispatchEvent(
          new CustomEvent('drag-end', {
            detail: {
              newValue: that.cleanedCoordinates(),
              elementDetails: { element: that.element, resizerQuery: that.resizerQuery }
            }
          })
        )
      }
    }
  }

  cleanedCoordinates() {
    return {
      height: this.toFloatValue(this.element.style.height),
      width: this.toFloatValue(this.element.style.width),
      left: this.toFloatValue(this.element.style.left),
      top: this.toFloatValue(this.element.style.top),
    }
  }

  toFloatValue(value) {
    return parseFloat(value.split('p')[0])
  }

}
export default Element