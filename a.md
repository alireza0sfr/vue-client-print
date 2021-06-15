diff --git a/a.md b/a.md
index 149b55d..e69de29 100644
--- a/a.md
+++ b/a.md
@@ -1,16 +0,0 @@
-2a3,5
->   <div v-show="true">
->     <p style="width: 600px;" id="toBeConverted">to be inserted</p>   => is a problem
->   </div>
-9,11d11
-<   <div v-show="true">
-<     <p id="toBeConverted">lorem50000</p>
-<   </div>
-19c19
-<         <div class="mainLoop" v-for="index in 3" :key="index"> => miare ba ykami tafavot miare => fqt to mainloop aval mirizatesh
----
->         <div class="mainLoop" v-for="index in settings.totalPages" :key="index">
-116c116
-<     // this.getHeight();
----
->     this.getHeight();
diff --git a/package-lock.json b/package-lock.json
index 78211ba..df6ee98 100644
--- a/package-lock.json
+++ b/package-lock.json
@@ -10,9 +10,8 @@
         "bootstrap-icons": "^1.5.0",
         "core-js": "^3.6.5",
         "html2canvas": "^1.0.0-rc.7",
-        "html2pdf": "^0.0.11",
         "html2pdf.js": "^0.9.3",
-        "jspdf": "^1.4.1",
+        "jspdf": "^2.3.1",
         "register-service-worker": "^1.7.1",
         "vue": "^3.0.0",
         "vue-router": "^4.0.0-0",
@@ -1323,6 +1322,19 @@
         "regenerator-runtime": "^0.13.4"
       }
     },
+    "node_modules/@babel/runtime-corejs3": {
+      "version": "7.14.6",
+      "resolved": "https://registry.npmjs.org/@babel/runtime-corejs3/-/runtime-corejs3-7.14.6.tgz",
+      "integrity": "sha512-Xl8SPYtdjcMoCsIM4teyVRg7jIcgl8F2kRtoCcXuHzXswt9UxZCS6BzRo8fcnCuP6u2XtPgvyonmEPF57Kxo9Q==",
+      "optional": true,
+      "dependencies": {
+        "core-js-pure": "^3.14.0",
+        "regenerator-runtime": "^0.13.4"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
     "node_modules/@babel/template": {
       "version": "7.12.13",
       "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.12.13.tgz",
@@ -1593,6 +1605,12 @@
       "integrity": "sha512-0/HnwIfW4ki2D8L8c9GVcG5I72s9jP5GSLVF0VIXDW00kmIpA6O33G7a8n59Tmh7Nz0WUC3rSb7PTY/sdW2JzA==",
       "dev": true
     },
+    "node_modules/@types/raf": {
+      "version": "3.4.0",
+      "resolved": "https://registry.npmjs.org/@types/raf/-/raf-3.4.0.tgz",
+      "integrity": "sha512-taW5/WYqo36N7V39oYyHP9Ipfd5pNFvGTIQsNGj86xV88YQ7GnI30/yMfKDF7Zgin0m3e+ikX88FvImnK4RjGw==",
+      "optional": true
+    },
     "node_modules/@types/range-parser": {
       "version": "1.2.3",
       "resolved": "https://registry.npmjs.org/@types/range-parser/-/range-parser-1.2.3.tgz",
@@ -2877,7 +2895,6 @@
       "version": "2.1.2",
       "resolved": "https://registry.npmjs.org/atob/-/atob-2.1.2.tgz",
       "integrity": "sha512-Wm6ukoaOGJi/73p/cl2GvLjTI5JM1k/O14isD73YML8StrH/7/lRFgmg8nICZgD3bZZvjwCGxtMOD3wWNAu8cg==",
-      "dev": true,
       "bin": {
         "atob": "bin/atob.js"
       },
@@ -3462,6 +3479,17 @@
         "url": "https://opencollective.com/browserslist"
       }
     },
+    "node_modules/btoa": {
+      "version": "1.2.1",
+      "resolved": "https://registry.npmjs.org/btoa/-/btoa-1.2.1.tgz",
+      "integrity": "sha512-SB4/MIGlsiVkMcHmT+pSmIPoNDoHg+7cMzmt3Uxt628MTz2487DKSqK/fuhFBrkuqrYv5UCEnACpF4dTFNKc/g==",
+      "bin": {
+        "btoa": "bin/btoa.js"
+      },
+      "engines": {
+        "node": ">= 0.4.0"
+      }
+    },
     "node_modules/buffer": {
       "version": "4.9.2",
       "resolved": "https://registry.npmjs.org/buffer/-/buffer-4.9.2.tgz",
@@ -3681,14 +3709,20 @@
       }
     },
     "node_modules/canvg": {
-      "version": "1.5.3",
-      "resolved": "https://registry.npmjs.org/canvg/-/canvg-1.5.3.tgz",
-      "integrity": "sha512-7Gn2IuQzvUQWPIuZuFHrzsTM0gkPz2RRT9OcbdmA03jeKk8kltrD8gqUzNX15ghY/4PV5bbe5lmD6yDLDY6Ybg==",
+      "version": "3.0.7",
+      "resolved": "https://registry.npmjs.org/canvg/-/canvg-3.0.7.tgz",
+      "integrity": "sha512-4sq6iL5Q4VOXS3PL1BapiXIZItpxYyANVzsAKpTPS5oq4u3SKbGfUcbZh2gdLCQ3jWpG/y5wRkMlBBAJhXeiZA==",
+      "optional": true,
       "dependencies": {
-        "jsdom": "^8.1.0",
+        "@babel/runtime-corejs3": "^7.9.6",
+        "@types/raf": "^3.4.0",
+        "raf": "^3.4.1",
         "rgbcolor": "^1.0.1",
-        "stackblur-canvas": "^1.4.1",
-        "xmldom": "^0.1.22"
+        "stackblur-canvas": "^2.0.0",
+        "svg-pathdata": "^5.0.5"
+      },
+      "engines": {
+        "node": ">=8.0.0"
       }
     },
     "node_modules/case-sensitive-paths-webpack-plugin": {
@@ -4645,6 +4679,17 @@
         "semver": "bin/semver.js"
       }
     },
+    "node_modules/core-js-pure": {
+      "version": "3.14.0",
+      "resolved": "https://registry.npmjs.org/core-js-pure/-/core-js-pure-3.14.0.tgz",
+      "integrity": "sha512-YVh+LN2FgNU0odThzm61BsdkwrbrchumFq3oztnE9vTKC4KS2fvnPmcx8t6jnqAyOTCTF4ZSiuK8Qhh7SNcL4g==",
+      "hasInstallScript": true,
+      "optional": true,
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/core-js"
+      }
+    },
     "node_modules/core-util-is": {
       "version": "1.0.2",
       "resolved": "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.2.tgz",
@@ -5512,6 +5557,12 @@
         "domelementtype": "1"
       }
     },
+    "node_modules/dompurify": {
+      "version": "2.2.9",
+      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-2.2.9.tgz",
+      "integrity": "sha512-+9MqacuigMIZ+1+EwoEltogyWGFTJZWU3258Rupxs+2CGs4H914G9er6pZbsme/bvb5L67o2rade9n21e4RW/w==",
+      "optional": true
+    },
     "node_modules/domutils": {
       "version": "1.7.0",
       "resolved": "https://registry.npmjs.org/domutils/-/domutils-1.7.0.tgz",
@@ -6306,6 +6357,11 @@
         "node": ">=0.8.0"
       }
     },
+    "node_modules/fflate": {
+      "version": "0.4.8",
+      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.4.8.tgz",
+      "integrity": "sha512-FJqqoDBR00Mdj9ppamLa/Y7vxm+PRmNWA67N846RvsoYVMKB4q3y/de5PA7gUmRMYK/8CMz2GDZQmCRN1wBcWA=="
+    },
     "node_modules/figgy-pudding": {
       "version": "3.5.2",
       "resolved": "https://registry.npmjs.org/figgy-pudding/-/figgy-pudding-3.5.2.tgz",
@@ -7125,11 +7181,6 @@
         "node": ">=8.0.0"
       }
     },
-    "node_modules/html2pdf": {
-      "version": "0.0.11",
-      "resolved": "https://registry.npmjs.org/html2pdf/-/html2pdf-0.0.11.tgz",
-      "integrity": "sha1-E1kVb73qwOxvyKeBsF6HR97Rl2k="
-    },
     "node_modules/html2pdf.js": {
       "version": "0.9.3",
       "resolved": "https://registry.npmjs.org/html2pdf.js/-/html2pdf.js-0.9.3.tgz",
@@ -7140,6 +7191,34 @@
         "jspdf": "1.4.1"
       }
     },
+    "node_modules/html2pdf.js/node_modules/canvg": {
+      "version": "1.5.3",
+      "resolved": "https://registry.npmjs.org/canvg/-/canvg-1.5.3.tgz",
+      "integrity": "sha512-7Gn2IuQzvUQWPIuZuFHrzsTM0gkPz2RRT9OcbdmA03jeKk8kltrD8gqUzNX15ghY/4PV5bbe5lmD6yDLDY6Ybg==",
+      "dependencies": {
+        "jsdom": "^8.1.0",
+        "rgbcolor": "^1.0.1",
+        "stackblur-canvas": "^1.4.1",
+        "xmldom": "^0.1.22"
+      }
+    },
+    "node_modules/html2pdf.js/node_modules/jspdf": {
+      "version": "1.4.1",
+      "resolved": "https://registry.npmjs.org/jspdf/-/jspdf-1.4.1.tgz",
+      "integrity": "sha512-2vYVdrvrQUdKKPyWHw81t1jEYYAJ6uFJ/HtTcGbI4qXIQEdl18dLEuL2wTeSv2GzeQLSgUvEvwsXsszuHK+PTw==",
+      "dependencies": {
+        "canvg": "^1.0",
+        "cf-blob.js": "0.0.1",
+        "file-saver": "1.3.8",
+        "omggif": "1.0.7",
+        "stackblur": "^1.0.0"
+      }
+    },
+    "node_modules/html2pdf.js/node_modules/stackblur-canvas": {
+      "version": "1.4.1",
+      "resolved": "https://registry.npmjs.org/stackblur-canvas/-/stackblur-canvas-1.4.1.tgz",
+      "integrity": "sha1-hJqm+UsnL/JvZHH6QTDtH35HlVs="
+    },
     "node_modules/htmlparser2": {
       "version": "3.10.1",
       "resolved": "https://registry.npmjs.org/htmlparser2/-/htmlparser2-3.10.1.tgz",
@@ -8232,15 +8311,19 @@
       }
     },
     "node_modules/jspdf": {
-      "version": "1.4.1",
-      "resolved": "https://registry.npmjs.org/jspdf/-/jspdf-1.4.1.tgz",
-      "integrity": "sha512-2vYVdrvrQUdKKPyWHw81t1jEYYAJ6uFJ/HtTcGbI4qXIQEdl18dLEuL2wTeSv2GzeQLSgUvEvwsXsszuHK+PTw==",
+      "version": "2.3.1",
+      "resolved": "https://registry.npmjs.org/jspdf/-/jspdf-2.3.1.tgz",
+      "integrity": "sha512-1vp0USP1mQi1h7NKpwxjFgQkJ5ncZvtH858aLpycUc/M+r/RpWJT8PixAU7Cw/3fPd4fpC8eB/Bj42LnsR21YQ==",
       "dependencies": {
-        "canvg": "^1.0",
-        "cf-blob.js": "0.0.1",
-        "file-saver": "1.3.8",
-        "omggif": "1.0.7",
-        "stackblur": "^1.0.0"
+        "atob": "^2.1.2",
+        "btoa": "^1.2.1",
+        "fflate": "^0.4.8"
+      },
+      "optionalDependencies": {
+        "canvg": "^3.0.6",
+        "core-js": "^3.6.0",
+        "dompurify": "^2.2.0",
+        "html2canvas": "^1.0.0-rc.5"
       }
     },
     "node_modules/jsprim": {
@@ -10793,6 +10876,15 @@
       "integrity": "sha512-FIqgj2EUvTa7R50u0rGsyTftzjYmv/a3hO345bZNrqabNqjtgiDMgmo4mkUjd+nzU5oF3dClKqFIPUKybUyqoQ==",
       "dev": true
     },
+    "node_modules/raf": {
+      "version": "3.4.1",
+      "resolved": "https://registry.npmjs.org/raf/-/raf-3.4.1.tgz",
+      "integrity": "sha512-Sq4CW4QhwOHE8ucn6J34MqtZCeWFP2aQSmrlroYgqAV1PjStIhJXxYuTgUIfkEk7zTLjmIjLmU5q+fbD1NnOJA==",
+      "optional": true,
+      "dependencies": {
+        "performance-now": "^2.1.0"
+      }
+    },
     "node_modules/randombytes": {
       "version": "2.1.0",
       "resolved": "https://registry.npmjs.org/randombytes/-/randombytes-2.1.0.tgz",
@@ -10919,7 +11011,7 @@
       "version": "0.13.7",
       "resolved": "https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.7.tgz",
       "integrity": "sha512-a54FxoJDIr27pgf7IgeQGxmqUNYrcV338lf/6gH456HZ/PhX+5BcwHXG9ajESmwe6WRO0tAzRUrRmNONWgkrew==",
-      "dev": true
+      "devOptional": true
     },
     "node_modules/regenerator-transform": {
       "version": "0.14.5",
@@ -12034,9 +12126,13 @@
       "integrity": "sha1-tAen4FyTsI1miDu4CNfLo6UD8S8="
     },
     "node_modules/stackblur-canvas": {
-      "version": "1.4.1",
-      "resolved": "https://registry.npmjs.org/stackblur-canvas/-/stackblur-canvas-1.4.1.tgz",
-      "integrity": "sha1-hJqm+UsnL/JvZHH6QTDtH35HlVs="
+      "version": "2.5.0",
+      "resolved": "https://registry.npmjs.org/stackblur-canvas/-/stackblur-canvas-2.5.0.tgz",
+      "integrity": "sha512-EeNzTVfj+1In7aSLPKDD03F/ly4RxEuF/EX0YcOG0cKoPXs+SLZxDawQbexQDBzwROs4VKLWTOaZQlZkGBFEIQ==",
+      "optional": true,
+      "engines": {
+        "node": ">=0.1.14"
+      }
     },
     "node_modules/stackframe": {
       "version": "1.2.0",
@@ -12369,6 +12465,15 @@
         "node": ">=4"
       }
     },
+    "node_modules/svg-pathdata": {
+      "version": "5.0.5",
+      "resolved": "https://registry.npmjs.org/svg-pathdata/-/svg-pathdata-5.0.5.tgz",
+      "integrity": "sha512-TAAvLNSE3fEhyl/Da19JWfMAdhSXTYeviXsLSoDT1UM76ADj5ndwAPX1FKQEgB/gFMPavOy6tOqfalXKUiXrow==",
+      "optional": true,
+      "engines": {
+        "node": ">=6.9.5"
+      }
+    },
     "node_modules/svg-tags": {
       "version": "1.0.0",
       "resolved": "https://registry.npmjs.org/svg-tags/-/svg-tags-1.0.0.tgz",
@@ -15809,6 +15914,16 @@
         "regenerator-runtime": "^0.13.4"
       }
     },
+    "@babel/runtime-corejs3": {
+      "version": "7.14.6",
+      "resolved": "https://registry.npmjs.org/@babel/runtime-corejs3/-/runtime-corejs3-7.14.6.tgz",
+      "integrity": "sha512-Xl8SPYtdjcMoCsIM4teyVRg7jIcgl8F2kRtoCcXuHzXswt9UxZCS6BzRo8fcnCuP6u2XtPgvyonmEPF57Kxo9Q==",
+      "optional": true,
+      "requires": {
+        "core-js-pure": "^3.14.0",
+        "regenerator-runtime": "^0.13.4"
+      }
+    },
     "@babel/template": {
       "version": "7.12.13",
       "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.12.13.tgz",
@@ -16055,6 +16170,12 @@
       "integrity": "sha512-0/HnwIfW4ki2D8L8c9GVcG5I72s9jP5GSLVF0VIXDW00kmIpA6O33G7a8n59Tmh7Nz0WUC3rSb7PTY/sdW2JzA==",
       "dev": true
     },
+    "@types/raf": {
+      "version": "3.4.0",
+      "resolved": "https://registry.npmjs.org/@types/raf/-/raf-3.4.0.tgz",
+      "integrity": "sha512-taW5/WYqo36N7V39oYyHP9Ipfd5pNFvGTIQsNGj86xV88YQ7GnI30/yMfKDF7Zgin0m3e+ikX88FvImnK4RjGw==",
+      "optional": true
+    },
     "@types/range-parser": {
       "version": "1.2.3",
       "resolved": "https://registry.npmjs.org/@types/range-parser/-/range-parser-1.2.3.tgz",
@@ -17139,8 +17260,7 @@
     "atob": {
       "version": "2.1.2",
       "resolved": "https://registry.npmjs.org/atob/-/atob-2.1.2.tgz",
-      "integrity": "sha512-Wm6ukoaOGJi/73p/cl2GvLjTI5JM1k/O14isD73YML8StrH/7/lRFgmg8nICZgD3bZZvjwCGxtMOD3wWNAu8cg==",
-      "dev": true
+      "integrity": "sha512-Wm6ukoaOGJi/73p/cl2GvLjTI5JM1k/O14isD73YML8StrH/7/lRFgmg8nICZgD3bZZvjwCGxtMOD3wWNAu8cg=="
     },
     "autoprefixer": {
       "version": "9.8.6",
@@ -17614,6 +17734,11 @@
         "node-releases": "^1.1.71"
       }
     },
+    "btoa": {
+      "version": "1.2.1",
+      "resolved": "https://registry.npmjs.org/btoa/-/btoa-1.2.1.tgz",
+      "integrity": "sha512-SB4/MIGlsiVkMcHmT+pSmIPoNDoHg+7cMzmt3Uxt628MTz2487DKSqK/fuhFBrkuqrYv5UCEnACpF4dTFNKc/g=="
+    },
     "buffer": {
       "version": "4.9.2",
       "resolved": "https://registry.npmjs.org/buffer/-/buffer-4.9.2.tgz",
@@ -17801,14 +17926,17 @@
       "dev": true
     },
     "canvg": {
-      "version": "1.5.3",
-      "resolved": "https://registry.npmjs.org/canvg/-/canvg-1.5.3.tgz",
-      "integrity": "sha512-7Gn2IuQzvUQWPIuZuFHrzsTM0gkPz2RRT9OcbdmA03jeKk8kltrD8gqUzNX15ghY/4PV5bbe5lmD6yDLDY6Ybg==",
+      "version": "3.0.7",
+      "resolved": "https://registry.npmjs.org/canvg/-/canvg-3.0.7.tgz",
+      "integrity": "sha512-4sq6iL5Q4VOXS3PL1BapiXIZItpxYyANVzsAKpTPS5oq4u3SKbGfUcbZh2gdLCQ3jWpG/y5wRkMlBBAJhXeiZA==",
+      "optional": true,
       "requires": {
-        "jsdom": "^8.1.0",
+        "@babel/runtime-corejs3": "^7.9.6",
+        "@types/raf": "^3.4.0",
+        "raf": "^3.4.1",
         "rgbcolor": "^1.0.1",
-        "stackblur-canvas": "^1.4.1",
-        "xmldom": "^0.1.22"
+        "stackblur-canvas": "^2.0.0",
+        "svg-pathdata": "^5.0.5"
       }
     },
     "case-sensitive-paths-webpack-plugin": {
@@ -18573,6 +18701,12 @@
         }
       }
     },
+    "core-js-pure": {
+      "version": "3.14.0",
+      "resolved": "https://registry.npmjs.org/core-js-pure/-/core-js-pure-3.14.0.tgz",
+      "integrity": "sha512-YVh+LN2FgNU0odThzm61BsdkwrbrchumFq3oztnE9vTKC4KS2fvnPmcx8t6jnqAyOTCTF4ZSiuK8Qhh7SNcL4g==",
+      "optional": true
+    },
     "core-util-is": {
       "version": "1.0.2",
       "resolved": "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.2.tgz",
@@ -19279,6 +19413,12 @@
         "domelementtype": "1"
       }
     },
+    "dompurify": {
+      "version": "2.2.9",
+      "resolved": "https://registry.npmjs.org/dompurify/-/dompurify-2.2.9.tgz",
+      "integrity": "sha512-+9MqacuigMIZ+1+EwoEltogyWGFTJZWU3258Rupxs+2CGs4H914G9er6pZbsme/bvb5L67o2rade9n21e4RW/w==",
+      "optional": true
+    },
     "domutils": {
       "version": "1.7.0",
       "resolved": "https://registry.npmjs.org/domutils/-/domutils-1.7.0.tgz",
@@ -19932,6 +20072,11 @@
         "websocket-driver": ">=0.5.1"
       }
     },
+    "fflate": {
+      "version": "0.4.8",
+      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.4.8.tgz",
+      "integrity": "sha512-FJqqoDBR00Mdj9ppamLa/Y7vxm+PRmNWA67N846RvsoYVMKB4q3y/de5PA7gUmRMYK/8CMz2GDZQmCRN1wBcWA=="
+    },
     "figgy-pudding": {
       "version": "3.5.2",
       "resolved": "https://registry.npmjs.org/figgy-pudding/-/figgy-pudding-3.5.2.tgz",
@@ -20570,11 +20715,6 @@
         "css-line-break": "1.1.1"
       }
     },
-    "html2pdf": {
-      "version": "0.0.11",
-      "resolved": "https://registry.npmjs.org/html2pdf/-/html2pdf-0.0.11.tgz",
-      "integrity": "sha1-E1kVb73qwOxvyKeBsF6HR97Rl2k="
-    },
     "html2pdf.js": {
       "version": "0.9.3",
       "resolved": "https://registry.npmjs.org/html2pdf.js/-/html2pdf.js-0.9.3.tgz",
@@ -20583,6 +20723,36 @@
         "es6-promise": "^4.2.5",
         "html2canvas": "^1.0.0-alpha.12",
         "jspdf": "1.4.1"
+      },
+      "dependencies": {
+        "canvg": {
+          "version": "1.5.3",
+          "resolved": "https://registry.npmjs.org/canvg/-/canvg-1.5.3.tgz",
+          "integrity": "sha512-7Gn2IuQzvUQWPIuZuFHrzsTM0gkPz2RRT9OcbdmA03jeKk8kltrD8gqUzNX15ghY/4PV5bbe5lmD6yDLDY6Ybg==",
+          "requires": {
+            "jsdom": "^8.1.0",
+            "rgbcolor": "^1.0.1",
+            "stackblur-canvas": "^1.4.1",
+            "xmldom": "^0.1.22"
+          }
+        },
+        "jspdf": {
+          "version": "1.4.1",
+          "resolved": "https://registry.npmjs.org/jspdf/-/jspdf-1.4.1.tgz",
+          "integrity": "sha512-2vYVdrvrQUdKKPyWHw81t1jEYYAJ6uFJ/HtTcGbI4qXIQEdl18dLEuL2wTeSv2GzeQLSgUvEvwsXsszuHK+PTw==",
+          "requires": {
+            "canvg": "^1.0",
+            "cf-blob.js": "0.0.1",
+            "file-saver": "1.3.8",
+            "omggif": "1.0.7",
+            "stackblur": "^1.0.0"
+          }
+        },
+        "stackblur-canvas": {
+          "version": "1.4.1",
+          "resolved": "https://registry.npmjs.org/stackblur-canvas/-/stackblur-canvas-1.4.1.tgz",
+          "integrity": "sha1-hJqm+UsnL/JvZHH6QTDtH35HlVs="
+        }
       }
     },
     "htmlparser2": {
@@ -21418,15 +21588,17 @@
       "dev": true
     },
     "jspdf": {
-      "version": "1.4.1",
-      "resolved": "https://registry.npmjs.org/jspdf/-/jspdf-1.4.1.tgz",
-      "integrity": "sha512-2vYVdrvrQUdKKPyWHw81t1jEYYAJ6uFJ/HtTcGbI4qXIQEdl18dLEuL2wTeSv2GzeQLSgUvEvwsXsszuHK+PTw==",
+      "version": "2.3.1",
+      "resolved": "https://registry.npmjs.org/jspdf/-/jspdf-2.3.1.tgz",
+      "integrity": "sha512-1vp0USP1mQi1h7NKpwxjFgQkJ5ncZvtH858aLpycUc/M+r/RpWJT8PixAU7Cw/3fPd4fpC8eB/Bj42LnsR21YQ==",
       "requires": {
-        "canvg": "^1.0",
-        "cf-blob.js": "0.0.1",
-        "file-saver": "1.3.8",
-        "omggif": "1.0.7",
-        "stackblur": "^1.0.0"
+        "atob": "^2.1.2",
+        "btoa": "^1.2.1",
+        "canvg": "^3.0.6",
+        "core-js": "^3.6.0",
+        "dompurify": "^2.2.0",
+        "fflate": "^0.4.8",
+        "html2canvas": "^1.0.0-rc.5"
       }
     },
     "jsprim": {
@@ -23547,6 +23719,15 @@
       "integrity": "sha512-FIqgj2EUvTa7R50u0rGsyTftzjYmv/a3hO345bZNrqabNqjtgiDMgmo4mkUjd+nzU5oF3dClKqFIPUKybUyqoQ==",
       "dev": true
     },
+    "raf": {
+      "version": "3.4.1",
+      "resolved": "https://registry.npmjs.org/raf/-/raf-3.4.1.tgz",
+      "integrity": "sha512-Sq4CW4QhwOHE8ucn6J34MqtZCeWFP2aQSmrlroYgqAV1PjStIhJXxYuTgUIfkEk7zTLjmIjLmU5q+fbD1NnOJA==",
+      "optional": true,
+      "requires": {
+        "performance-now": "^2.1.0"
+      }
+    },
     "randombytes": {
       "version": "2.1.0",
       "resolved": "https://registry.npmjs.org/randombytes/-/randombytes-2.1.0.tgz",
@@ -23654,7 +23835,7 @@
       "version": "0.13.7",
       "resolved": "https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.7.tgz",
       "integrity": "sha512-a54FxoJDIr27pgf7IgeQGxmqUNYrcV338lf/6gH456HZ/PhX+5BcwHXG9ajESmwe6WRO0tAzRUrRmNONWgkrew==",
-      "dev": true
+      "devOptional": true
     },
     "regenerator-transform": {
       "version": "0.14.5",
@@ -24610,9 +24791,10 @@
       "integrity": "sha1-tAen4FyTsI1miDu4CNfLo6UD8S8="
     },
     "stackblur-canvas": {
-      "version": "1.4.1",
-      "resolved": "https://registry.npmjs.org/stackblur-canvas/-/stackblur-canvas-1.4.1.tgz",
-      "integrity": "sha1-hJqm+UsnL/JvZHH6QTDtH35HlVs="
+      "version": "2.5.0",
+      "resolved": "https://registry.npmjs.org/stackblur-canvas/-/stackblur-canvas-2.5.0.tgz",
+      "integrity": "sha512-EeNzTVfj+1In7aSLPKDD03F/ly4RxEuF/EX0YcOG0cKoPXs+SLZxDawQbexQDBzwROs4VKLWTOaZQlZkGBFEIQ==",
+      "optional": true
     },
     "stackframe": {
       "version": "1.2.0",
@@ -24886,6 +25068,12 @@
         "has-flag": "^3.0.0"
       }
     },
+    "svg-pathdata": {
+      "version": "5.0.5",
+      "resolved": "https://registry.npmjs.org/svg-pathdata/-/svg-pathdata-5.0.5.tgz",
+      "integrity": "sha512-TAAvLNSE3fEhyl/Da19JWfMAdhSXTYeviXsLSoDT1UM76ADj5ndwAPX1FKQEgB/gFMPavOy6tOqfalXKUiXrow==",
+      "optional": true
+    },
     "svg-tags": {
       "version": "1.0.0",
       "resolved": "https://registry.npmjs.org/svg-tags/-/svg-tags-1.0.0.tgz",
diff --git a/package.json b/package.json
index 4edf7a1..b8cf6d8 100644
--- a/package.json
+++ b/package.json
@@ -10,9 +10,8 @@
     "bootstrap-icons": "^1.5.0",
     "core-js": "^3.6.5",
     "html2canvas": "^1.0.0-rc.7",
-    "html2pdf": "^0.0.11",
     "html2pdf.js": "^0.9.3",
-    "jspdf": "^1.4.1",
+    "jspdf": "^2.3.1",
     "register-service-worker": "^1.7.1",
     "vue": "^3.0.0",
     "vue-router": "^4.0.0-0",
diff --git a/src/components/PrintStatic.vue b/src/components/PrintStatic.vue
index d0e8975..c33eb0e 100644
--- a/src/components/PrintStatic.vue
+++ b/src/components/PrintStatic.vue
@@ -17,7 +17,7 @@
         </tr>
       </thead>
       <tbody>
-        <tr v-for="index in 100" :key="index">
+        <tr v-for="index in 72" :key="index">
           <td>{{index}}</td>
           <td>ردیف تست</td>
           <td>ردیف تست</td>
@@ -37,7 +37,7 @@
         <div
           :style="{'border': '1px solid black', 'border-bottom': '1px solid black', 'height': settings.defaultHeightOfPaper + 'in'}"
           class="mainLoop"
-          v-for="index in 20"
+          v-for="index in 4"
           :key="index"
         >
           <div
@@ -68,12 +68,14 @@
             :style="{
           'height': settings.totalHeightOfAPaper + 'in'}"
             class="converted"
-          ></body>
+          >
+            <p>asdafsDFkbjsd</p>
+          </body>
           <div
             class="fixedFooterCondition"
             v-if="settings.hasFooter && settings.isFooterRepeatable || index == 1"
           >
-            <footer class="MainFooter" id="break">
+            <footer class="MainFooter break html2pdf__page-break">
               {{settings.customFooter}}
               <br />
               <div
@@ -181,12 +183,11 @@ export default {
         margin: this.settings.margin,
         filename: this.settings.fileName,
         image: { type: "jpeg", quality: 1 },
-        html2canvas: { dpi: 300, width: 1430},
+        html2canvas: { dpi: 300, width: 1430 },
         jsPDF: {
           unit: "px",
           format: this.settings.pageSize,
           orientation: this.settings.orientation,
-          
         },
       };
       html2pdf().set(opt).from(element).save();
@@ -315,9 +316,8 @@ export default {
             clnCanvas.style.marginTop = index * this.settings.marginTop + "in";
 
             // Adding the calculated height and width of the body to cln canvas
-            clnCanvas.style.height = this.settings.totalHeightOfAPaper
-            clnCanvas.style.width = this.settings.defaultWidthOfPaper
-
+            clnCanvas.style.height = this.settings.totalHeightOfAPaper;
+            clnCanvas.style.width = this.settings.defaultWidthOfPaper;
 
             convertedElement[index].appendChild(clnCanvas);
           }
diff --git a/todo.md b/todo.md
index 99ea8e8..4c78958 100644
--- a/todo.md
+++ b/todo.md
@@ -25,11 +25,13 @@ print component:
         -Done fixedfooteronpage1
         -Done v bind div child style to getHeight value
         -Done default unit to in
+        -Done test jspdf in a branch and use addPage functionallity to break the page 
 
-        -test jspdf in a branch and use addPage functionallity to break the page 
         
         -fix the page break bug
 
+        -call calculateSize method from the v-for
+
         -print Bug
 
         -props watch
@@ -39,16 +41,5 @@ print component:
         -data array
         -test
 
-
     -Dynamic
-        """Takes the  data from the customer and customize the html page and then print it"""
-
-        npm install bootstrap popper.js jquery --save-dev 
-
-TODO the func is working but has an empty canvas
-TODO search it has answer in stack and the print bug is canvas
-TODO it can print empty canvas tho
-
-html2canvas(document.getElementById('toBeConverted')).then(function(canvas) {
-            document.getElementById('converted').appendChild(canvas) 
-            }) 
\ No newline at end of file
+        """Takes the  data from the customer and customize the html page and then print it"""
\ No newline at end of file
