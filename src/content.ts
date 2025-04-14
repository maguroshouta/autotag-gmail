function getElementByXPath(sValue: string) {
	const a = document.evaluate(
		sValue,
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null,
	);
	if (a.snapshotLength > 0) {
		return a.snapshotItem(0);
	}
}

function searchMailElement(): Promise<Node> {
	return new Promise((resolve) => {
		const interval = setInterval(() => {
			const mail_element = getElementByXPath(
				"/html/body/div[6]/div[3]/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div[8]/div/div[1]/div[2]/div/table/tbody",
			);
			if (mail_element) {
				clearInterval(interval);
				resolve(mail_element);
			}
		}, 1000);
	});
}

(async () => {
	const mail_element = await searchMailElement();

	const mail_elements = mail_element.childNodes;

	for (const element of mail_elements) {
		const trs = element.childNodes;
		const response = await fetch("http://localhost:11434/api/generate", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: JSON.stringify({
				model: "gemma3:12b",
				prompt: `
      You are an AI that categorizes emails.
      Based on the content of the received email, classify it into one of the following three categories:
      Normal: Regular, general emails that do not contain especially important information.
      Important: Emails containing urgent or significant matters that require prompt attention.
      Advertising: Emails intended for advertising, promotions, or sales purposes.
      Please understand the email content and respond with the appropriate category name (Normal, Important, or Advertising) as a single word.

      Email content: ${trs[4].childNodes[0].textContent?.replace("配信停止", "")}
      `,
				stream: false,
			}),
		});
		const data = await response.json();
		const div = document.createElement("div");
		div.style.height = "16px";
		if (data.response === "Normal") {
			div.style.backgroundColor = "green";
		}
		if (data.response === "Important") {
			div.style.backgroundColor = "red";
		}
		if (data.response === "Advertising") {
			div.style.backgroundColor = "orange";
		}
		div.style.borderRadius = "4px";
		div.style.display = "flex";
		div.style.alignItems = "center";
		div.style.justifyContent = "center";
		div.style.margin = "0 4px";
		div.style.padding = "4px";

		const p = document.createElement("p");
		p.innerText = data.response;
		p.style.fontWeight = "bold";
		p.style.fontSize = "14px";
		p.style.color = "white";

		div.appendChild(p);
		element.appendChild(div);
	}
})();
