print component:
    -Done date and time header
    -Done Custom Header
    -Done Logo 
    -Done age counter
    -Done custom footer
    -Done paper size (4=a4, 3=a3, ...)
    -Done oriantation (landscape, portraite)
    -Done r2l or l2r functionality
    -Done page counter position
    -Done padding
    -Done page counter loop
    -Done fixed header at everypage or dynamic
    -Done Body
    -Done margin
    -Done page break
    -Done unit px
    -Done preview button => convert2Canvas function
    -Done remove the last child in convert 2 canvas
    -Done getHeightfunc
    -Done total height in px
    -Done total pages
    -Done fixedfooteronpage1
    -Done v bind div child style to getHeight value
    -Done default unit to in
    -Done test jspdf in a branch and use addPage functionallity to break the page 
    -Done fix the page break bug
    -Done backgound-position-y yAxis
    -Done print Bug => replace issue 19 code with printform
    -Done extra page at the beginning
    -Done set the width to page width and have scroll
    -Done contol div height with mouse
    -Done element size won't change if 2 divs hit
    -Done fix line-height of the footer
    -Done Add position relative
    

    -ability to write in text inputs
    -add drag ability to text inputs



    -page 1 footer size
    -other pages footer size
    -page 1 header size
    -other pages header size

    -props watch
    -modal with checkboxes for users
    -toast for processing...
    -slots
    -data array
    -test

    textInputHeader() {
      // Making the text area at click
      let n = 0;
      let headerSection = document.getElementsByClassName("textInput")[0];
      headerSection.addEventListener("mousedown", initEditHeader, false);

      function initEditHeader() {
        if (n < 1) {
          headerSection.removeChild(headerSection.firstChild);
          let inputField = document.createElement("TEXTAREA");
          inputField.className = "inputField";
          inputField.setAttribute("type", "text");
          inputField.setAttribute("placeholder", "Type Your Header");
          headerSection.appendChild(inputField);
          headerSection.addEventListener("mouseenter", hoverEditHeader, false);
          n += 1;
        }
      }
      function hoverEditHeader() {
        console.log('hover');
        let textInput = document.getElementsByClassName("inputField");
        textInput.className = "inputFieldOn";
        headerSection.addEventListener("mouseleave", HoverEditHeaderOff, false);
      }
      function HoverEditHeaderOff() {
        console.log('hoveroff');
        let textInput = document.getElementsByClassName("inputField");
        textInput.className = "inputFieldOff";
      }
    