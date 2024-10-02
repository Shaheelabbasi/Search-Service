
const app = require('./app.js');
const { connectDb } = require('./Db/connect.js');

connectDb()
  .then(() => {
    app.listen(11000, () =>
      console.log(`Search Server is running on the port 11000`)
    );
  })
  .catch(err => console.log(err));

  