
module.exports = {

loadRegHelper: function (reloadAnyway) {
            if (typeof Reg !== "undefined" && reloadAnyway == null) {
                  return;
            }

            Reg = new(function() {
                  var file = "./Registro1.json";
                  this.data = {};

                  try {
                        this.data = JSON.parse(fs.readFileSync(file));
                  } catch (e) {
                        log("[Runtime Error] Base de datos no encontrada. Generando bajo el nombre: " + file);
                        fs.writeFileSync(file, "{}")
                  }

                  this.save = function(key, value) {
                        this.data[key] = value;
                        this.saveData();
                  }

                  this.init = function(key, value) {
                        if (this.data[key] === undefined) {
                              this.data[key] = value;
                              this.saveData();
                              log("[BASE][" + key + "] Listo.")
                        }
                  }

                  this.get = function(key) {
                        return this.data[key];
                  }

                  this.remove = function(key) {
                        if (this.data[key] != undefined) {
                              delete this.data[key];
                              this.saveData();
                        }
                  }

                  this.removeIf = function(func) {
                        var x, d = this.data,
                              madeChange = false;
                        for (x in d) {
                              if (func(d, x)) {
                                    delete d[x];
                                    madeChange = true;
                              }
                        }

                        if (madeChange) {
                              this.saveData();
                        }
                  }

                  this.removeIfValue = function(key, value) {
                        if (this.data[key] === value) {
                              delete this.data[key];
                              this.saveData();
                        }
                  }

                  this.saveData = function() {
                        fs.writeFileSync(file, JSON.stringify(this.data), "utf8", (err) => {
                              if (err) throw err;
                              log("[BASE][Run] %Save Data%");
                        });
                  }

                  this.clearAll = function() {
                        this.data = {};
                        this.saveData();
                  }

            })();

      }

}