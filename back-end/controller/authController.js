// import querystring from 'querystring';
// import { sendConfirmationEmail } from './emailService.js';


// if (req.method === "POST" && req.url === "/auth/signup.html") {
//   let body = [];
//   req
//     .on("data", (chunk) => {
//       body.push(chunk);
//     })
//     .on("end", () => {
//       body = Buffer.concat(body).toString();
//       let values = querystring.parse(body);
//       console.log(values);
//       console.log(body);
//       const email = values.email;
//       const username = values.username;
//       //rewrite this part
//       res.writeHead(302, { Location: "../pages/products/products.html" });
//       sendConfirmationEmail(email, username);
//       res.end();
//     });
// }
