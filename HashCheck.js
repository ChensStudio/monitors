const Chain3 = require('chain3');

let monitorMainRoots = [ 
						// {url: '18.233.50.84:8932', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
						// ,{url: '18.211.187.153:8932', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
						// ,{url: '54.71.244.228:8932', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
						// ,{url: '52.34.175.72:8392', alias: 'Boot Node', owner: 'David Chen', networkID: '99'}
						{url: '18.130.240.247:8932', alias: 'Boot Node London', owner: 'Xinle Yang', networkID: '99'}
						,{url: '13.211.142.153:8932', alias: 'Boot Node Syndney', owner: 'Xinle Yang', networkID: '99'}
						,{url: '35.182.237.1:8932', alias: 'Boot Node C. Canada', owner: 'Xinle Yang', networkID: '99'}
						,{url: '139.198.122.215:8932', alias: 'Boot Node, Guandong China', owner: 'Qing Xu', networkID: '99'}
						,{url: '47.88.237.205:8932', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '99'}
						,{url: '47.74.9.125:8932', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '99'}
						,{url: '47.105.44.41:8932', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
						,{url: '39.107.107.211:8932', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
						,{url: '39.104.149.149:8932', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
						,{url: '106.15.187.168:8932', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
						// ,{url: '47.75.59.170:8545', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
						,{url: '47.107.54.38:8932', alias: 'Moac Node China', owner: 'Qing Xu', networkID: '99'}
						];

let monitorTestRoots = [
						{url: '39.108.79.40:8932', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '101'}
						,{url: '47.98.255.26:8932', alias: 'Boot Node China', owner: 'Qing Xu', networkID: '101'}
						,{url: '18.217.180.94:8932', alias: 'Boot Node US', owner: 'Zhengpeng Li', networkID: '101'}
						,{url: '18.188.171.176:8932', alias: 'Boot Node US', owner: 'Zhengpeng Li', networkID: '101'}
						,{url: '52.15.143.41:8932', alias: 'Boot Node US', owner: 'Zhengpeng Li', networkID: '101'}
						];

let chain3 = new Chain3();

// chain3.setProvider(new chain3.providers.HttpProvider('http://139.198.122.215:8932'));
// chain3.setProvider(new chain3.providers.HttpProvider('http://13.211.142.153:8932'));

// curBlockHeight = chain3.mc.getBlock(100);
// console.log(curBlockHeight.hash);

let blockNumber = 0;
let mainResult = [];
let mainWarning = false;
let lastHash = '';

//MainNet
for (let i = 0; i < monitorMainRoots.length; i++){
	// console.log(monitorMainRoots[i].url);
	chain3.setProvider(new chain3.providers.HttpProvider('http://' + monitorMainRoots[i].url));
	if (blockNumber === 0) {
		blockNumber = chain3.mc.blockNumber - 5;
	}

	// if (curBlockHeight > maxHeight){
	// 	maxHeight = curBlockHeight;
	// 	maxHeightIndex = i;
	// }

	curBlockHeight = chain3.mc.getBlock(blockNumber);
	// console.log(blockNumber) ;
	// console.log(curBlockHeight.hash);	

	mainResult.push({
		url: 'http://' + monitorMainRoots[i].url,
		blockNumber: blockNumber,
		hash: curBlockHeight.hash
	});

	if (lastHash === ''){
		lastHash = curBlockHeight.hash;
	}
	else if (lastHash !== curBlockHeight.hash){
		mainWarning = true;
	}
}

blockNumber = 0;
let testResult = [];
let testWarning = false;
lastHash = '';

//TestNet
for (let i = 0; i < monitorTestRoots.length; i++){
	// console.log(monitorTestRoots[i].url);
	chain3.setProvider(new chain3.providers.HttpProvider('http://' + monitorTestRoots[i].url));
	if (blockNumber === 0) {
		blockNumber = chain3.mc.blockNumber - 5;
	}

	// if (curBlockHeight > maxHeight){
	// 	maxHeight = curBlockHeight;
	// 	maxHeightIndex = i;
	// }

	curBlockHeight = chain3.mc.getBlock(blockNumber);
	// console.log(blockNumber) ;
	// console.log(curBlockHeight.hash);	

	testResult.push({
		url: 'http://' + monitorTestRoots[i].url,
		blockNumber: blockNumber,
		hash: curBlockHeight.hash
	});

	if (lastHash === ''){
		lastHash = curBlockHeight.hash;
	}
	else if (lastHash !== curBlockHeight.hash){
		testWarning = true;
	}
}

console.log('Mainnet \n');
console.log(mainResult);

console.log('Testnet \n');
console.log(testResult);


if(mainWarning){
	sendMail(mainResult, 'Highly possibility of fork situation. Please check APAP.');
}
if(testWarning){
	sendMail(testResult, 'Highly possibility of fork situation. Please check APAP.');
}


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
	  subject: 'Moac Root Node Issue',
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