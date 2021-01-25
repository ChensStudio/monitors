// this version is for local test purpose, which will not send email out

const Chain3 = require('chain3');
// const nodemailer = require('nodemailer');

let monitorTestnetGatewayUrls = [
                                    {url: 'http://gateway.moac.io/testnet', alias: 'Testnet Gateway'}
                                    ,{url: 'http://124.71.40.201:8932', alias: 'Testnet China'}
                                    ,{url: 'http://34.217.90.193:8932', alias: 'Testnet OR'}
                                    ,{url: 'http://18.185.83.122:8932',alias: 'Testnet Frankfurt'}
                                ]

let monitorMainnetGatewayUrls = [
                                    {url: 'http://gateway.moac.io/mainnet', alias: 'Mainnet Gateway'}
                                    ,{url: 'http://124.71.20.30:8932', alias: 'Mainnet China'}
                                    ,{url: 'http://35.161.103.244:8932', alias: 'Mainnet OR'}
                                    ,{url: 'http://13.53.72.84:8932', alias: 'Mainnet Stockholm'}
                                    ,{url: 'http://3.127.39.74:8932', alias: 'Mainnet Frankfurt'}
                                    ,{url: 'http://35.178.188.187:8932', alias: 'Mainnet London'}
                                ]

let threshold = 4;
let chain3 = new Chain3();
let blockHeights = new Array();
let maxHeight = 0;
let curBlockHieght = 0;
let mailBody = '';
let instruction = 'To restart a moac node, please login to server and run \"sudo systemctl restart moac_nuwa\"';

for (let i = 0; i < monitorTestnetGatewayUrls.length; i++){
    try{
        chain3.setProvider(new chain3.providers.HttpProvider(monitorTestnetGatewayUrls[i].url));
        curBlockHieght = chain3.mc.blockNumber;
        maxHeight = (curBlockHieght > maxHeight)? curBlockHieght:maxHeight;
        blockHeights[i] = curBlockHieght;
    }
    catch(e)
    {
        blockHeights[i] = 0;
    }
}
for (let i = 0; i < blockHeights.length; i++){
    if (Math.abs(blockHeights[i]-maxHeight)>threshold){
        mailBody = mailBody + "Please check testnet server " + monitorTestnetGatewayUrls[i].alias + ' (url: '+ monitorTestnetGatewayUrls[i].url + 
        ' blockchain height: ' + blockHeights[i] + ')\n';
    }
}
console.log(blockHeights);


blockHeights = new Array();
maxHeight = 0;
curBlockHieght = 0;
for (let i = 0; i < monitorMainnetGatewayUrls.length; i++){
    try{
        chain3.setProvider(new chain3.providers.HttpProvider(monitorMainnetGatewayUrls[i].url));
        curBlockHieght = chain3.mc.blockNumber;
        maxHeight = (curBlockHieght > maxHeight)? curBlockHieght:maxHeight;
        blockHeights[i] = curBlockHieght;
    }
    catch(e)
    {
        blockHeights[i] = 0;
    }
}
for (let i = 0; i < blockHeights.length; i++){
    if (Math.abs(blockHeights[i]-maxHeight)>threshold){
        mailBody = mailBody + "Please check mainnet server " + monitorMainnetGatewayUrls[i].alias + ' (url: '+ monitorMainnetGatewayUrls[i].url + 
        ' blockchain height: ' + blockHeights[i] + ')\n';
    }
}
console.log(blockHeights);

console.log(mailBody);

// if(mailBody != ''){
//     var transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'gatewaymonitor.moac@gmail.com',
//         pass: '1qaz@WSX3edc'
//       }
//     });

//     var mailOptions = {
//       from: 'gatewaymonitor.moac@gmail.com',
//       to: 'yang.chen@moac.io; xinle.yang@moac.io',
//       subject: 'Moac Gateway Issue (This is not a test)',
//       text: mailBody + '\n' + instruction
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });
// }
