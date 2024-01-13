// window.location.href = `https://web.telegram.org/a/#-1001144740753`;

$("body").prepend(
  `<section id='moe-ext'><button id="check-legit">Check</button></section>`
);

$("#check-legit").on("click", async function () {
  const groupID = window.location.hash.replace("#", "");
  const res = await fetch("https://telemoe.glitch.me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add other headers as needed
    },
    body: JSON.stringify({
      group_ids: [groupID],
    }),
  });
  const json = await res.json();
  const members = json.members.slice(1);
  for (let contact of members) {
    const groups = await getCommonGroups(contact);
    console.log(groups);
  }
});

async function getCommonGroups(contact) {
  let length = 0;
  let data = [];
  window.open(`https://web.telegram.org/a/#${contact}`);
  await sleep(1000);
  const groupButton = $(".Tab.Tab--interactive .Tab_inner:contains('Groups')");
  if (groupButton.length !== 0) {
    groupButton.click();
    await sleep(1000);
    const commonGroups = $(".commonChats-list .ChatInfo");
    length = commonGroups.length;
    console.log("common groups", commonGroups);
    commonGroups.each((index, ele) => {
      data.push(ele.innerText);
    });
  }

  return { length, data };
}
