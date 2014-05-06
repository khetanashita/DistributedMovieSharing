var listOfServers = [ 'Server1', 'Server2', 'Server3', 'Server4', 'Server5', 'Server6' ];
var takemod = -1;

testRoundRobin();

function testRoundRobin() {
	for (var i=0; i<10; i++) {
		var server = roundRobin();
		console.log(server + "\n");
	}
}


function roundRobin() {

	var numberOfServers = listOfServers.length;
	takemod = (takemod+1)%numberOfServers;
	return listOfServers[takemod];
}