# Events

## Print Success
Triggers: When printing was successfull.

Name: print-success

Data: response
```html
<Print @print-success"someMethods" />
```

## Print Error
Triggers: When printing wasn't successfull.

Name: print-error

Data: error
```html
<Print @print-error"someMethods" />
```

## Prview Success
Triggers: When print preview was rendered successfully.

Name: preview-success

Data: res
```html
<Print @preview-success"someMethods" />
```

## Prview Error
Triggers: When print preview wasn't rendered successfully.

Name: preview-error

Data: error
```html
<Print @preview-error"someMethods" />
```