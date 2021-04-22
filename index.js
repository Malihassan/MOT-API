const expr = require("express");
const axios = require('axios');

const app = expr();
//middleware  
app.use(expr.json());
const router = require("./router/router")
app.use(router)


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})