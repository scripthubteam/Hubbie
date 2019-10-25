# Reg Helper

```js
const db = require("./db/reghelper.js");
db.loadRegHelper();
Reg.init("<Object>", "{}")
if (typeof Object == 'undefined') {
              Object = {};
              try {
                  Object = JSON.parse(Reg.get("Object"));
              } catch (e) {
                  Object = {};
              }
          }
```