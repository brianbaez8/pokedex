import express from "express";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/_health', (_req, res) => {
  res.send('Server is running!')
})

app.listen(PORT, () => {
  console.log(`App Listening on Port: ${PORT}`);
});
