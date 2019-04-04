const Chain3 = require('chain3');
const nodemailer = require('nodemailer');
const threshold = 120;

let monitorTestnetGatewayUrls = [
                                    {url: 'http://59.111.60.141:8932', alias: 'Testnet China'}
                                    ,{url: 'http://34.220.200.118:8932', alias: 'Testnet OR'}
                                    ,{url: 'http://18.185.83.122:8932',alias: 'Testnet Frankfurt'}
                                ];

let maxHeight = 0;
let maxHeightIndex = 0;
let curBlockHeight = 0;

let chain3 = new Chain3();

for (let i = 0; i < monitorTestnetGatewayUrls.length; i++){
    chain3.setProvider(new chain3.providers.HttpProvider(monitorTestnetGatewayUrls[i].url));
    curBlockHeight = chain3.mc.blockNumber;

    if (curBlockHeight > maxHeight){
        maxHeight = curBlockHeight;
        maxHeightIndex = i;
    }
}

chain3.setProvider(new chain3.providers.HttpProvider(monitorTestnetGatewayUrls[maxHeightIndex].url));

curBlockHeight = chain3.mc.blockNumber;
let curBlockTimeStamp = chain3.mc.getBlock(curBlockHeight).timestamp;

let timeStamp = Math.floor(Date.now()/1000);

let diffTimeStamp = timeStamp - curBlockTimeStamp;

console.log(diffTimeStamp);

if(diffTimeStamp > threshold){
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gatewaymonitor.moac@gmail.com',
        pass: '1qaz@WSX3edc'
      }
    });

    var mailOptions = {
      from: 'gatewaymonitor.moac@gmail.com',
      to: 'yang.chen@moac.io; xinle.yang@moac.io; zhengpeng.li@moac.io; david.chen@moac.io; qing.xu@moac.io',
      subject: 'Moac Testnet Mining Machine Issue',
      text: 'Please check mining machine. No new block generated in 90 seconds.'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}
