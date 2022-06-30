const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

dotenv.config();

// CONFIG
const salt = 6;

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    secure: false,
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Import models
const User = require('./models/User');
const ProductName = require('./models/Product');
const Eat = require('./models/Eat');
const WeightChange = require('./models/WeightChange');

const Messages = require('./messages/messages')

const _PORT = 3005;
const _DATABASE_URI = "mongodb://localhost/sirena";

// 24h in milliseconds
const oneDay = 1000 * 60 * 60 * 24;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(_DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let connection = mongoose.connection;
connection.on('error', console.error.bind(console, "< ! > MongoDB connection error < ! >"))

const jwtSignOptions = {
    expiresIn: "1h"
}

const generateAccessToken = (userInfo) => {
    return jwt.sign(userInfo, process.env.TOKEN_SECRET, jwtSignOptions);
}

const generateVerificationToken = (userInfo) => {
    return jwt.sign(userInfo, process.env.USER_VERIFICATION_SECRET, jwtSignOptions);
}

const authenticateToken = (req, res, next) => {
    const token = req.body.token;
  
    if (token == null) return res.sendStatus(401)
  
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) console.log(err)
        if (err) return res.sendStatus(403)
  
        req.user = user
        next()
    })
}

app.get('/', (req, res) => {
    res.send({ message: "Welcome to Sirena API v0.0" });
});

app.post('/createUser', (req, res) => {
    User.exists({ email: req.body.email }, function(err, result) {
        if (err) {
            res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
        } else {
            if(result == null) {
                let plainPassword = req.body.password;
                let hashedPassword;

                bcrypt.hash(plainPassword, salt, function(err, hash) {
                    hashedPassword = hash;
                    const tempUser = new User({
                        _id: mongoose.Types.ObjectId(),
                        full_name: req.body.full_name,
                        email: req.body.email,
                        password: hashedPassword
                    });

                    const verificationToken = generateVerificationToken({email: tempUser.email});
                    const verificationUrl = `http://localhost:3005/verify/${verificationToken}`;

                    transporter.sendMail({  
                        to: tempUser.email,
                        from: `Sirena Nutrition <${process.env.EMAIL}>`,
                        subject: 'Account verification',
                        html: `<!doctype html>
                        <html>
                          <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                            <title>Account verification email</title>
                            <style>
                              /* -------------------------------------
                                  GLOBAL RESETS
                              ------------------------------------- */
                              
                              /*All the styling goes here*/
                              
                              img {
                                border: none;
                                -ms-interpolation-mode: bicubic;
                                max-width: 100%; 
                              }
                        
                              body {
                                background-color: #f6f6f6;
                                font-family: 'Inter';
                                -webkit-font-smoothing: antialiased;
                                font-size: 14px;
                                line-height: 1.4;
                                margin: 0;
                                padding: 0;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%; 
                              }
                        
                              table {
                                border-collapse: separate;
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                width: 100%; }
                                table td {
                                  font-family: 'Inter';
                                  font-size: 14px;
                                  vertical-align: top; 
                              }
                        
                              /* -------------------------------------
                                  BODY & CONTAINER
                              ------------------------------------- */
                        
                              .body {
                                background-color: #f6f6f6;
                                width: 100%; 
                              }
                        
                              /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                              .container {
                                display: block;
                                margin: 0 auto !important;
                                /* makes it centered */
                                max-width: 580px;
                                padding: 10px;
                                width: 580px; 
                              }
                        
                              /* This should also be a block element, so that it will fill 100% of the .container */
                              .content {
                                box-sizing: border-box;
                                display: block;
                                margin: 0 auto;
                                max-width: 580px;
                                padding: 10px; 
                              }
                        
                              /* -------------------------------------
                                  HEADER, FOOTER, MAIN
                              ------------------------------------- */
                              .main {
                                background: #ffffff;
                                border-radius: 3px;
                                width: 100%; 
                              }
                        
                              .wrapper {
                                box-sizing: border-box;
                                padding: 20px; 
                              }
                        
                              .content-block {
                                padding-bottom: 10px;
                                padding-top: 10px;
                              }
                        
                              .footer {
                                clear: both;
                                margin-top: 10px;
                                text-align: center;
                                width: 100%; 
                              }
                                .footer td,
                                .footer p,
                                .footer span,
                                .footer a {
                                  color: #999999;
                                  font-size: 12px;
                                  text-align: center; 
                              }
                        
                              /* -------------------------------------
                                  TYPOGRAPHY
                              ------------------------------------- */
                              h1,
                              h2,
                              h3,
                              h4 {
                                color: #000000;
                                font-family: 'Inter';
                                font-weight: 400;
                                line-height: 1.4;
                                margin: 0;
                                margin-bottom: 30px; 
                              }
                        
                              h1 {
                                font-size: 35px;
                                font-weight: 300;
                                text-align: center;
                                text-transform: capitalize; 
                              }
                        
                              p,
                              ul,
                              ol {
                                font-family: 'Inter';
                                font-size: 18px;
                                font-weight: normal;
                                margin: 0;
                                margin-bottom: 15px; 
                              }
                                p li,
                                ul li,
                                ol li {
                                  list-style-position: inside;
                                  margin-left: 5px; 
                              }
                        
                              a {
                                color: #032248;
                                text-decoration: underline; 
                              }
                        
                              /* -------------------------------------
                                  BUTTONS
                              ------------------------------------- */
                              .btn {
                                box-sizing: border-box;
                                width: 100%; }
                                .btn > tbody > tr > td {
                                  padding-bottom: 15px; }
                                .btn table {
                                  width: auto; 
                              }
                                .btn table td {
                                  background-color: #ffffff;
                                  /* border-radius: 5px; */
                                  text-align: center; 
                              }
                                .btn a {
                                  background-color: #ffffff;
                                  border: solid 1px #032248;
                                  border-radius: 5px;
                                  box-sizing: border-box;
                                  color: #032248;
                                  cursor: pointer;
                                  display: inline-block;
                                  font-size: 18px;
                                  font-weight: bold;
                                  margin: 0;
                                  padding: 12px 25px;
                                  text-decoration: none;
                                  text-transform: capitalize; 
                              }
                        
                              .btn-primary table td {
                                background-color: #032248; 
                              }
                        
                              .btn-primary a {
                                background-color: #032248;
                                border-color: #032248;
                                color: #ffffff; 
                              }
                        
                              /* -------------------------------------
                                  OTHER STYLES THAT MIGHT BE USEFUL
                              ------------------------------------- */
                              .last {
                                margin-bottom: 0; 
                              }
                        
                              .first {
                                margin-top: 0; 
                              }
                        
                              .align-center {
                                text-align: center; 
                              }
                        
                              .align-right {
                                text-align: right; 
                              }
                        
                              .align-left {
                                text-align: left; 
                              }
                        
                              .clear {
                                clear: both; 
                              }
                        
                              .mt0 {
                                margin-top: 0; 
                              }
                        
                              .mb0 {
                                margin-bottom: 0; 
                              }
                        
                              .preheader {
                                color: transparent;
                                display: none;
                                height: 0;
                                max-height: 0;
                                max-width: 0;
                                opacity: 0;
                                overflow: hidden;
                                mso-hide: all;
                                visibility: hidden;
                                width: 0; 
                              }
                        
                              .powered-by a {
                                text-decoration: none; 
                              }
                        
                              .p-tag {
                                text-align: center;
                              }
                        
                              hr {
                                border: 0;
                                border-bottom: 1px solid #f6f6f6;
                                margin: 20px 0; 
                              }
                        
                              /* -------------------------------------
                                  RESPONSIVE AND MOBILE FRIENDLY STYLES
                              ------------------------------------- */
                              @media only screen and (max-width: 620px) {
                                table.body h1 {
                                  font-size: 28px !important;
                                  margin-bottom: 10px !important; 
                                }
                                table.body p,
                                table.body ul,
                                table.body ol,
                                table.body td,
                                table.body span,
                                table.body a {
                                  font-size: 16px !important; 
                                }
                                table.body .wrapper,
                                table.body .article {
                                  padding: 10px !important; 
                                }
                                table.body .content {
                                  padding: 0 !important; 
                                }
                                table.body .container {
                                  padding: 0 !important;
                                  width: 100% !important; 
                                }
                                table.body .main {
                                  border-left-width: 0 !important;
                                  border-radius: 0 !important;
                                  border-right-width: 0 !important; 
                                }
                                table.body .btn table {
                                  width: 100% !important; 
                                }
                                table.body .btn a {
                                  width: 100% !important; 
                                }
                                table.body .img-responsive {
                                  height: auto !important;
                                  max-width: 100% !important;
                                  width: auto !important; 
                                }
                              }
                        
                              /* -------------------------------------
                                  PRESERVE THESE STYLES IN THE HEAD
                              ------------------------------------- */
                              @media all {
                                .ExternalClass {
                                  width: 100%; 
                                }
                                .ExternalClass,
                                .ExternalClass p,
                                .ExternalClass span,
                                .ExternalClass font,
                                .ExternalClass td,
                                .ExternalClass div {
                                  line-height: 100%; 
                                }
                                .apple-link a {
                                  color: inherit !important;
                                  font-family: 'Inter' !important;
                                  font-size: inherit !important;
                                  font-weight: inherit !important;
                                  line-height: inherit !important;
                                  text-decoration: none !important; 
                                }
                                #MessageViewBody a {
                                  color: inherit;
                                  text-decoration: none;
                                  font-size: inherit;
                                  font-family: 'Inter';
                                  font-weight: inherit;
                                  line-height: inherit;
                                }
                              }
                        
                            </style>
                          </head>
                          <body>
                            <span class="preheader">This is an automated account verification email sent to you by Sirena.</span>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                              <tr>
                                <td>&nbsp;</td>
                                <td class="container">
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center">
                                            <img src="https://lh3.googleusercontent.com/YER84tgeIyanNgldYLxLa7dEjHLpv4EE5w-I2HtNCRUZehJFVdThlcO3UxNZd4oLGM50AnuPBjkeBoGXMSL32wdqWi4sRKZwoMcce6FO3DHRRpLdv7qyTNe62x-LSxaW_nrsitAN0sGW6xQ3DrT6zvIdPKuBfqSfUexjIP365HU1sLH7kswoSe_Xzczi4T5vzJqKDSYNF14BTOYUiYAGsX8LENgkvoyPER9Np1Xx_ub9ELUziQ1odHE9bDh_WGEkSehSrFzG-KnnPwDyZedxyJ1k6C3gVChCLW_WbrSLDTnPMDIXCzSxPz7nrjXFXoKpytyqT1t0ZZIBIt7MJBl_BSv7-RF9O5XZpdKIcsKwbIccTXucZxKjah9cT_ORhcYY7H-6NqjTCXuX86N2kcAnqvZvqvWQq-IQMqpC72_8Tf63FWLOyV-K7xOBKSj0E4bgGQ8hFRskccgtG_mPeeNdRle_KaA3vihpYj5loJZ8l7q5f48L0hJ1nAnMDz-W_PheKNuNWEfct51URXzELpbY1ikuIM1dIMfRCgblhMydw7zTr2BUTF_61-gHNRxkAYk8tnFXmJZN9PlbhqdJtYeqqaUQr3AnjIv6mkokzkz0cbS1Hwi9YoKQzN4AZoz_sOai7RwIWm_Hwm_A-qmnyKk4tRO3brmxFKOUaEvzIF-AFjdevliOF_0wCIX66WqEgyTtau2HRH8EazkgO5ukaWodrUzgfH_lVkWsgUYC5LkevVj0TsDj0v7X6Qqtd9i4D7G0mJuWJJl7X1cz9Wp0ye2US_r_ftfEb4ZGNn0sgHYHOWh6jbfHRQ801NftFr4z254WoLg7z0b-SegpK8qYQHL5pf4enKhfpoVGevoobdq9Tlso0eUFy02apVrtEJkIYp_KeNSZDwPyQbbBYDbL9_AzYcLl282aJLSEAMIzam4gdcwmHrNtPftCYWeetseaZ4FqHhZUjsRvYsSu9m9zqNkH=w408-h355-no?authuser=6" width="128px" height="auto" alt="Sirena Logo" title="Logo">
                                        </td>
                                    </tr>
                                  </table>
                                  <div class="content">
                        
                                    <!-- START CENTERED WHITE CONTAINER -->
                                    <table role="presentation" class="main">
                        
                                      <!-- START MAIN CONTENT AREA -->
                                      <tr>
                                        <td class="wrapper">
                                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                              <td>
                                                <h1>Verify your account</h1>
                                                <p class="p-tag">Thanks for signing up for a Sirena account. Confirm your email address by clicking the button below.</p>
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                                  <tbody>
                                                    <tr align="center">
                                                      <td align="center">
                                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                            <tr align="center">
                                                              <td align="center"> <a href="${verificationUrl}" target="_blank">CONFIRM</a> </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                                <!-- <p>This is a really simple email template. Its sole purpose is to get the recipient to click the button with no distractions.</p>
                                                <p>Good luck! Hope it works.</p> -->
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                        
                                    <!-- END MAIN CONTENT AREA -->
                                    </table>
                                    <!-- END CENTERED WHITE CONTAINER -->
                        
                                    <!-- START FOOTER -->
                                    <div class="footer">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td class="content-block">
                                            <span class="apple-link">Sirena nutrition app</span>
                                            <!-- <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>. -->
                                          </td>
                                        </tr>
                                        <tr>
                                          <td class="content-block powered-by">
                                            <!-- Powered by <a href="http://htmlemail.io">HTMLemail</a>. -->
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                    <!-- END FOOTER -->
                        
                                  </div>
                                </td>
                                <td>&nbsp;</td>
                              </tr>
                            </table>
                          </body>
                        </html>`
                    })
                
                    tempUser.save(function (err) {
                        if(err) return res.send({ outcome: err });
                        res.send({ outcome: Messages.USER_CREATED_SUCCESSFULLY });
                    })
                });
            } else {
                res.send({ outcome: Messages.EMAIL_AREADY_IN_USE });
            }
        }
    });
});

app.post('/login', (req, res) => {
    userEmail = req.body.email;

    let userFromDB;
    
    User.findOne({ email: userEmail }, function(err, user) {
        if(err) return res.send({ outcome: err });
        userFromDB = user;

        if(userFromDB != null) {
            if(userFromDB.is_email_verified == false) return res.send({ outcome: Messages.EMAIL_NOT_VERIFIED })
              bcrypt.compare(req.body.password, userFromDB.password, function(err, result) {
                  if(err) return err;
                  if(result == true) {
                      let token = generateAccessToken({ 
                          email: userFromDB.email,
                          full_name: userFromDB.full_name,
                          age: userFromDB.age,
                          weight: userFromDB.weight,
                          height: userFromDB.height,
                          daily_calorie_goal: userFromDB.daily_calorie_goal,
                          calories_left: userFromDB.calories_left,
                          is_new_user: userFromDB.is_new_user 
                      })
                      return res.send({outcome: Messages.LOGIN_SUCCESSFUL, token: token});
                  } else {
                      return res.send({outcome: Messages.PASSWORD_OR_EMAIL_INCORRECT});
                  }
              });
          } else {
              res.send({outcome: Messages.USER_WITH_EMAIL_DOES_NOT_EXIST})
          }
    })
})

app.get('/verify/:token', (req, res) => {
  const token = req.params;
  
  if(!token.token) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  let userData;

  try {
    userData = jwt.verify(token.token, process.env.USER_VERIFICATION_SECRET);
    let userFromDB;
      
    User.findOne({ email: userData.email }, function(err, user) {
        if(err) return res.send({ outcome: err });
        userFromDB = user;
  
        if(userFromDB != null) {
          User.updateOne({ "email": userFromDB.email }, { "is_email_verified": true }, (err, result) => {
            if(err) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
            return res.send({ outcome: Messages.SUCCESS })
          })
        }
    })
  } catch(err) {
    return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  }

})

app.post('/setAge', authenticateToken, (req, res) => {
  const token = req.body.token;

  if(!token) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  let userData;

  try {
    userData = jwt.verify(token, process.env.TOKEN_SECRET);

    User.updateOne({ "email": userData.email }, { "age": req.body.age }, (err, result) => {
      if(err) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
      return res.send({ outcome: Messages.SUCCESS })
    })
  } catch(err) {
    return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  }
})

app.post('/setHeight', authenticateToken, (req, res) => {
  const token = req.body.token;

  if(!token) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  let userData;

  try {
    userData = jwt.verify(token, process.env.TOKEN_SECRET);

    User.updateOne({ "email": userData.email }, { "height": req.body.height }, (err, result) => {
      if(err) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
      return res.send({ outcome: Messages.SUCCESS })
    })
  } catch(err) {
    return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  }
})

app.post('/setWeight', authenticateToken, (req, res) => {
  const token = req.body.token;

  if(!token) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  let userData;

  try {
    userData = jwt.verify(token, process.env.TOKEN_SECRET);

    const oldWeight = userData.weight;

    User.updateOne({ "email": userData.email }, { "weight": req.body.weight }, (err, result) => {
      if(err) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })

      const tempWeightChange = new WeightChange({
        _id: mongoose.Types.ObjectId(),
        old_weight: oldWeight,  
        new_weight: req.body.weight,
        userEmail: userData.email
      })

      return res.send({ outcome: Messages.SUCCESS })
    })
  } catch(err) {
    return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR })
  }
})

app.post('/eat', authenticateToken, (req, res) => {
  const productID = req.body.productID;
  let product;
  let token = req.body.token

  ProductName.findOne({ MatvareID: productID }, (err, result) => {
    if(err) return err;
    product = result;

    let calories = (parseInt(product.Kilokalorier) / 100) * req.body.grams;
    try {
      userData = jwt.verify(token, process.env.TOKEN_SECRET);
  
      User.updateOne({ "email": userData.email }, { "$inc": { "calories_left": -calories } }, (err, result) => {
        if(err) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR });
        
        const tempFood = new Eat({
          _id: mongoose.Types.ObjectId(),
          food_name: product.Matvare,
          food_id: productID,
          calories_consumed: calories,
          userEmail: userData.email
        });

        tempFood.save((err, result) => {
          if(err) return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR});
        });

        return res.send({ outcome: Messages.SUCCESS });
      })
    } catch(err) {
      return res.send({ outcome: Messages.INTERNAL_SERVER_ERROR });
    }
  })

})

// cron jobs
cron.schedule('0 0 0 * * *', () => {
    console.log("< ! > PERFORMING DAILY CALORIE RESET < ! >")
    User.updateMany(
        {},
        [{
            $set: {
                "calories_left": "$daily_calorie_goal"
            }
        }], function(err){if(err) console.log(err)}
    )
});

app.listen(_PORT, () => console.log(`Sirena API is started on port ${_PORT}!`));