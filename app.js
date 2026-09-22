/* const articleRouter = require("./routers/articleRouter");

const commentRouter = require("./routers/commentRouter"); */

const express = require('express');

const app = express();

app.use(express.json());

const PORT = 3000;

//import router cua user de xu ly cai API lien quan den user
const useRouter = require('./routers/articleRouter');
const use2Router = require('./routers/commentRouter');

//Kiem tra xem server co dang hoat dong ko
app.get("/", (req, res) => {
    res.status(200).json({
        message: "User REST API dang hoat dong",
    })
})


app.use("/articles", useRouter);
app.use("/comments", use2Router);

//Neu cac router nay ko ton tai
app.use((req, res) => {
    res.status(404).json({
        message: "API ko ton tai"
    })
})

app.listen(PORT, () => {
    console.log(`Server dang chay tai: http://localhost:${PORT}`)
})
