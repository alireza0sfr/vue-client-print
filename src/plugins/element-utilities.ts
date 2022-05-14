// @ts-ignore
import { IElement } from '~/interfaces/elements.ts'

class Element {

  element: IElement
  resizerQuery: string
  $el: HTMLElement

  constructor($el: HTMLElement, resizerQuery: string, element: IElement) {
    this.$el = $el
    this.resizerQuery = resizerQuery
    this.element = element
  }

  /**
   * make element resiable
   * @emits {size-changed} call size-changed event and passes cleanedCoordinates, element, queryResizer.
   */
  resizable(): void {
    var element = this.$el
    const resizers = document.querySelectorAll(`.elem-resizer.${this.resizerQuery}`)

    for (let resizer of resizers)
      // @ts-ignore
      resizer.onmousedown = (e: any) => initDrag(e, resizer)

    element.onmousedown = this.dragable

    var startX: number, startY: number, startWidth: number, startHeight: number, originalLeft: number, originalTop: number, that = this

    function initDrag(e: any, resizer: HTMLElement): void {
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
    function doDrag(e: any, resizer: HTMLElement): void {
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

    function stopDrag(e: any): void {
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
            elementDetails: { $el: that.$el, resizerQuery: that.resizerQuery, element: that.element }
          }
        })
      )
    }
  }

  /**
   * element click handler 
   * @emits {click} call click event and passes element, queryResizer.
   */
  clickable(): void {
    var element = this.$el
    var that = this
    element.addEventListener("mousedown", onClick, false)
    function onClick(e: any) {
      e.stopPropagation() // prevent event to call parent events aswell
      let selectedElements = document.getElementsByClassName('element selected')
      for (let index = 0; index < selectedElements.length; index++) {
        selectedElements[index].classList.remove('selected')
      }
      element.classList.add('selected')
      element.dispatchEvent(
        new CustomEvent('click', {
          detail: {
            elementDetails: { $el: that.$el, resizerQuery: that.resizerQuery, element: that.element }
          }
        })
      )
    }

  }

  /**
   * make element dragable
   * @emits {drag-end} call drag-end event and passes cleanedCoordinates, element, queryResizer.
   */
  dragable(): void {
    let element = this.$el
    var startX: number, startY: number, newLeft: number, newTop: number, that = this

    // move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown

    function dragMouseDown(e: any): void {
      if (e.target.className.includes('resizer'))
        return

      if (e.target.className.includes('element') || e.target.offsetParent.className.includes('element')) { // if dragging element or image element/variable
        e = e || window.event
        e.preventDefault()
        // get the mouse cursor position at startup:
        startX = e.clientX
        startY = e.clientY
        document.onmouseup = closeDragElement
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag
      }

      function elementDrag(e: any): void {
        e = e || window.event
        e.preventDefault()
        // calculate the new cursor position:
        newLeft = startX - e.clientX
        newTop = startY - e.clientY
        startX = e.clientX
        startY = e.clientY
        // set the element's new position:
        element.style.top = element.offsetTop - newTop + "px"
        element.style.left = element.offsetLeft - newLeft + "px"
      }

      function closeDragElement(): void {
        // stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
        element.dispatchEvent(new Event("finishededitingelement"))
        element.dispatchEvent(
          new CustomEvent('drag-end', {
            detail: {
              newValue: that.cleanedCoordinates(),
              elementDetails: { $el: that.$el, resizerQuery: that.resizerQuery, element: that.element }
            }
          })
        )
      }
    }
  }

  cleanedCoordinates(): object {
    return {
      height: this.toFloatValue(this.$el.style.height),
      width: this.toFloatValue(this.$el.style.width),
      left: this.toFloatValue(this.$el.style.left),
      top: this.toFloatValue(this.$el.style.top),
    }
  }

  toFloatValue(value: string): number {
    return parseFloat(value.split('p')[0])
  }

}
export default Element