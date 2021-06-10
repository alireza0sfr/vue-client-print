print component:
    -Static
        """"Takes data from the programmer as props and render the required html file and then print the html"""
        -props:
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
            -remove the last child in convert 2 canvas
            -getHeightfunc
            -v bind div child style to getHeight value
            -total height in px
            -total pages
            -props watch
            -modal with checkboxes instead of props
            -toast for processing...
            -slots
            -data array
            -test


    -Dynamic
        """Takes the  data from the customer and customize the html page and then print it"""

        npm install bootstrap popper.js jquery --save-dev 

TODO the func is working but has an empty canvas
TODO search it has answer in stack and the print bug is canvas
TODO it can print empty canvas tho

html2canvas(document.getElementById('toBeConverted')).then(function(canvas) {
            document.getElementById('converted').appendChild(canvas) 
            }) 