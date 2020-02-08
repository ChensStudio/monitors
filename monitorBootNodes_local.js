const curl=require('js-curl');
const nodemailer = require('nodemailer');

// let monitorTestRoots = ['39.108.79.40:30333'
//                         ,'47.98.255.26:30333'
//                         ,'107.155.107.194:30333'
//                         ,'107.155.125.100:30333'
//                         ,'107.155.76.183:30333']


// compute(monitorTestRoots).then(
//     res=>{
//         let mailBody = '';
//         for (let i = 0; i < res.length; i++){
//             // console.log(res[i]);
//             if(res[i].code != 52){
//                 mailBody = mailBody + "Please check testnet server " + res[i].server + '\n';
//             }
//         }

//         if(mailBody != ''){
//             console.log(mailBody, 'Please check MOAC service asap.');
//             // sendMail(mailBody, 'Please check MOAC service asap.');
//         }
//     }
// );


let monitorMainRoots = [
                        {url: '18.233.50.84:30333', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
                        ,{url: '18.211.187.153:30333', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
                        ,{url: '54.71.244.228:30333', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
                        ,{url: '52.34.175.72:30333', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
                        ,{url: '18.130.240.247:30333', alias: 'Boot Node London', owner: 'Xinle Yang', networkID: '99'}
                        ,{url: '13.211.142.153:30333', alias: 'Boot Node Syndney', owner: 'Xinle Yang', networkID: '99'}
                        ,{url: '35.182.237.1:30333', alias: 'Boot Node C. Canada', owner: 'Xinle Yang', networkID: '99'}
                        ,{url: '139.198.122.215:30333', alias: 'Boot Node, Guandong China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '47.88.237.205:30333', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '47.74.9.125:30333', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '47.105.44.41:30333', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '39.107.107.211:30333', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '39.104.149.149:30333', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '106.15.187.168:30333', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '47.75.59.170:30333', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '47.107.54.38:30333', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
                        ,{url: '39.108.79.40:30333', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '101'}
                        ,{url: '47.98.255.26:30333', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '101'}
                        ,{url: '18.217.180.94:30333', alias: 'Boot Node US', owner: 'Zhengpeng Li', networkID: '101'}
                        ,{url: '18.188.171.176:30333', alias: 'Boot Node US', owner: 'Zhengpeng Li', networkID: '101'}
                        ,{url: '52.15.143.41:30333', alias: 'Boot Node US', owner: 'Zhengpeng Li', networkID: '101'}
                        ];

compute(monitorMainRoots).then(
    res=>{
        let mailBody = '';
        for (let i = 0; i < res.length; i++){
            // console.log(res[i]);
            if(res[i].code != 52){
                mailBody = mailBody + "NetworkID: " + res[i].networkID + " " + res[i].alias + " Server: " + res[i].server + " Owner: " + res[i].owner + "\n";
            }
        }

        if(mailBody != ''){
            //sendMail(mailBody, 'Please check MOAC service asap.');
            console.log(mailBody);
        }
    }
);

// console.log(mailBody, 'Please check MOAC service asap.');
// sendMail(mailBody, 'Please check MOAC service asap!');


function sendMail(mailBody, instruction){
    mailBody = 'Please check below server(s): \n' + mailBody;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gatewaymonitor.moac@gmail.com',
        pass: '1qaz@WSX3edc'
      }
    });

    var mailOptions = {
      from: 'gatewaymonitor.moac@gmail.com',
      to: 'yang.chen@moac.io; xinle.yang@moac.io; zhengpeng.li@moac.io; david.chen@moac.io; qing.xu@moac.io; qxu@mossglobal.net',
      subject: 'Moac Boot Node Issue',
      text: mailBody + '\n' + instruction
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}


async function compute(addresses) {
    let x = new Array();

    for (let i=0; i<addresses.length; i++){
        const ret = await curlServer(addresses[i].url);
        x.push(
            {
                index: i
                ,server: addresses[i].url
                ,networkID: addresses[i].networkID
                ,alias: addresses[i].alias
                ,owner: addresses[i].owner
                ,code: ret
            });
    }

    return x;
}

function curlServer(addr) {
    var r = 0;
    return new Promise(function(resolve) {
        curl(addr,function(err,stdout,stderr){
            //console.log(monitorTestRoots[i] + ' ' + err.code);   //52 is OK, 7 is Wrong
            resolve(err.code);
        });
    });
}
