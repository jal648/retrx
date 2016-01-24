// app.get("/fellowship/species/:species", function(req, res) {
//   r.connect().then(function(conn) {
//     return r.db("test").table("fellowship")
//             .filter({species: req.params.species}).run(conn)
//         .finally(function() { conn.close(); });
//   })
//   .then(function(cursor) { return cursor.toArray(); })
//   .then(function(output) { res.json(output); })
//   .error(function(err) { res.status(500).json({err: err}); })
// });

// r.connect().then(function(c) {
//   return r.db("test").table("fellowship").changes().run(c);
// })
// .then(function(cursor) {
//   cursor.each(function(err, item) {
//     console.log(item);
//   });
// });


var sockio = require("socket.io"),
    express = require("express"),
    app = express(),
    r = require("rethinkdb");

app.use(express.static('client'))

var qry_transactions = r.table("transactions").orderBy({index: r.desc("when")})

var io = sockio.listen(app.listen(8090), {log: false});

io.on("connection", function(socket) {
  r.connect()
  .then(function(conn) {
    console.log("connected")
    return qry_transactions.limit(10).run(conn)
  })
  .then(function(cursor) {
    return cursor.toArray();
  })
  .then(function(output) {
    console.log("last 30", output)
    socket.emit("transactions/init", output);
  });
});

r.connect()
.then(function(conn) {
  return qry_transactions.changes().run(conn);
})
.then(function(cursor) {
  cursor.each(function(err, data) {
    console.log("Updated", data)
    if (data.old_val) {
        console.error("Updates not expected")
    } else {
        io.sockets.emit("transactions/added", data.new_val);
    }
  });
});


console.log("App listening on port 8090");