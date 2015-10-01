var makeSeq = function(seq){
	seq = seq.toString();
	while(seq.length < maxMoves) {
		seq = '0' + seq;
	}
	return seq;
};

var nextSeq = function(seq) {
	seq = parseInt(seq, 7);
	seq++;
	return makeSeq(seq.toString(7));
};

var games = 39860000;
var currentMove = 0;
var maxMoves = 16;
var maxSequence = '0400000000000000';
var sequence = '0301023423635431';

var reg = /(.)\1/i;
var timeout;

var go = function(){
	var threads = 80;
	while(threads--) {
		autoPlay();
	}
};

var gps = 0;
var hcform = document.getElementById('hc-form');
var hcmsg = document.getElementById('hc-msg');
var sendmsg = true;
var sendHCMsg = function(msg){
	hcmsg.value = msg ||
							  'Games: ' 	 				 + games +
							'. Sequence: ' 				 + sequence +
							'. Games per second: ' + gps;

	hcform.submit();
	if (sendmsg) {
		setTimeout(sendHCMsg, 1000 * 60 * 5);
	}
};

//setTimeout(sendHCMsg, 10000);
var worker = new Worker('worker.js');

var newSeq = function() {
	games++;
	sequence = nextSeq(sequence);
	while(
		reg.test(sequence) ||
		sequence.indexOf('0') === -1 ||
		sequence.indexOf('1') === -1 ||
		sequence.indexOf('2') === -1 ||
		sequence.indexOf('3') === -1 ||
		sequence.indexOf('4') === -1 ||
		sequence.indexOf('5') === -1 ||
		sequence.indexOf('6') === -1
	) {
		sequence = nextSeq(sequence);
		if (sequence === maxSequence) {
			console.log('koncowa sekwencja = ', sequence);
			alert('sprawdzilem wsio');
			return;
		}
	}

	worker.postMessage([sequence]);
};

worker.onmessage = function(e) {
	//console.log(e.data);
	newSeq();
};
