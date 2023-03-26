import express from "express";
import mailchimp from "@mailchimp/mailchimp_marketing";
import https from "https";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const dirname = path.resolve(path.dirname(""));

//mailchimp
const MCapiKey = "b455585fc144fe321ae7086f17f37f15-us21";
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

app.post("/fail", (req, res) => {
  res.redirect(path.join(dirname, "/"));
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(dirname, "success.html"));
});
app.get("/fail", (req, res) => {
  res.sendFile(path.join(dirname, "fail.html"));
});

app.post("/", async (req, res) => {
  var FName = req.body.FName;
  var LName = req.body.LName;
  var email = req.body.email;

  let data;

  const run = async () => {
    data = await mailchimp.lists.addListMember(MCListId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: FName,
        LNAME: LName,
      },
    });
    // console.log(data);
  };

  await run();

  //needed this because of await
  const memberJSON = await new Promise((resolve, reject) => {
    if (data) {
      resolve(data);
    } else {
      reject("Data is undefined");
    }
  });

  // console.log(memberJSON);

  const MCurl = `https://${MCServer}.api.mailchimp.com/3.0/lists/${MCListId}/members`;

  const options = {
    method: "POST",
    auth: `user:${MCapiKey}`,
  };

  const request = https.request(MCurl, options, (resp) => {
    resp.on("data", function (data) {
      console.log(JSON.parse(data));
      if (resp.statusCode === 200) {
        res.sendFile(path.join(dirname, "success.html"));
      } else {
        res.sendFile(path.join(dirname, "fail.html"));
      }
    });
  });

  console.log(memberJSON);
  request.write(JSON.stringify(memberJSON));
  request.end();
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});




