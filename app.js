import express from "express";
import mailchimp from "@mailchimp/mailchimp_marketing";
import path from "path";
import fs from "fs"

const app = express();
const port = process.env.PORT || 3000;
const dirname = path.resolve(path.dirname(""));

const apiKey = fs.readFileSync(path.join(dirname, "apikey.text"), 'utf8');

//mailchimp
const MCapiKey = apiKey.trim();
const MCServer = "us21";
const MCListId = "49efc1691a";

mailchimp.setConfig({
  apiKey: MCapiKey,
  server: MCServer,
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/", (req, res) => {
  res.sendFile(path.join(dirname, "signup.html"));
});

app.post("/", async (req, res) => {
  var FName = req.body.FName;
  var LName = req.body.LName;
  var email = req.body.email;

  const contact = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: FName,
      LNAME: LName,
    },
  };

  try {
    const response = await mailchimp.lists.addListMember(MCListId, contact);
    res.sendFile(path.join(dirname, "success.html"));

    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
  } catch (error) {
    res.sendFile(path.join(dirname, "fail.html"));
    console.error(error);
  }

});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
