/** @param {NS} ns */
export async function main(ns) {
	var output, cmd;
	const red = "\u001b[31m";
	const white = "\u001b[37m";
	const reset = "\u001b[0m";
	var host = ns.getHostname();
	var rshelld = ns.getPortHandle(1);
	var server = ns.getPortHandle(2);
	rshelld.clear();
	server.clear();
	while (server.empty()) {
		output = "";
		await ns.sleep(10);
		while (!server.empty()) {
			await ns.sleep(10);
			cmd = server.read();
			if (cmd == "ps") {
				var p = ns.ps(ns.getHostname());
				var o = `${white}PID   Threads       CMD${reset}\n `;
				for (let i = 0; i < p.length; i++) {
					o += white + p[i]["pid"] + "    " + p[i]["threads"] + "             " + p[i]["filename"] + "  " + p[i]["args"] + `${reset}\n `;
					if (i == p.length) {
						o += `${reset}`
					}
				}
				output = o
			}
			if (cmd == "ls") {
				output = `${white}`;
				var files = ns.ls(host);
				for (let i = 0; i < files.length; i++) {
					output += files[i] + `  `
				}
				output += `${reset}`
			}
			if (cmd == "scan") {
				var nodes = ns.scan(host);
				var o = `${white}Hostname         IP${reset}\n`;
				var sLength = o.length - 2;
				for (let i = 0; i < nodes.length; i++) {
					o += ` ${white}` + nodes[i] + " ".repeat(sLength - nodes[i].length) + ns.getServer(nodes[i]).ip + `${reset}\n`
				}
				output = o
			}
			if (cmd == 'whereami') {
				output = white+ns.getHostname()+reset
			}
			if (cmd == 'whoami') {
				output = white+'root'+reset
			}
		};
		if (output != undefined && output != "") {
			rshelld.write(`${white}(${reset}${red}${host}${white})\n${reset}  ${output}`)
		}
	}
}
