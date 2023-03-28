import express from "express";
import mailchimp from "@mailchimp/mailchimp_marketing";
import dotenv from "dotenv";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const dirname = path.resolve(path.dirname(""));

//server config
dotenv.config();

//mailchimp
const MCapiKey = process.env.apiKeyMC; //set on server
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

  const addListMember = async (MCListId, contact) => {
    const response = await mailchimp.lists.addListMember(MCListId, contact);
    console.log(`Successfully added contact.. The contact's id is ${response.id}.`);
    return response.id;
  };

  const sendResponse = (res, fileName) => {
    res.sendFile(path.join(dirname, fileName));
  };

  addListMember(MCListId, contact)
    .then(memberId => sendResponse(res, 'success.html'))
    .catch(error => {
      console.error(error);
      sendResponse(res, 'fail.html');
    });
  
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);

});
