let db;
const request = indexedDB.open("budget", 1);



request.success = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    check();
  }
};

function save(record) {
  const purchase = db.purchase(["pending"], "readwrite");
  const save = purchase.objectStore("pending");
  save.add(record);
}

function check() {
  const purchase = db.purchase(["pending"], "readwrite");
  const save = purchase.objectStore("pending");
  const get = save.get();

  get.success = function () {
    if (get.result.length > 0) {
      fetch("/api/purchase/bulk", {
        method: "POST",
        body: JSON.stringify(get.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          // delete records if successful
          const purchase = db.purchase(["pending"], "readwrite");
          const save = purchase.objectStore("pending");
          save.clear();
        });
    }
  };
}
  


window.addEventListener("online", check);
