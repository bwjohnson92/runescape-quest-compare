const fetch = require('node-fetch');
const argv = process.argv;

(async () => {
var names = argv.slice(-2);
let questDataPlayer1 = await getAPIData(names[0]);
let questDataPlayer2 = await getAPIData(names[1]);

let sortedQuestsPlayer1 = sortQuests(questDataPlayer1);
let sortedQuestsPlayer2 = sortQuests(questDataPlayer2);

let questsPlayer1CanDo = filterEligibleQuests(sortedQuestsPlayer1, sortedQuestsPlayer2);
let questsPlayer2CanDo = filterEligibleQuests(sortedQuestsPlayer2, sortedQuestsPlayer1);

console.log(names[0] + "'s eligible quests:");
console.log(JSON.stringify(questsPlayer1CanDo, null, 4));
console.log(names[1] + "'s eligible quests:");
console.log(JSON.stringify(questsPlayer2CanDo, null, 4));


})();

async function getAPIData(name) {

    let response = await fetch('https://apps.runescape.com/runemetrics/quests?user='+name)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Server response wasn't ok");
        }
    })
    .catch((err) => {
        console.log(err);
    });

    return response;
}

function sortQuests(questData) {
    let sorted = {completed: [], notCompleted: []};
    questData.quests.forEach(quest => {
        if (quest.status === "COMPLETED") {
            sorted.completed.push(quest.title);
        } else {
            sorted.notCompleted.push(quest.title);
        }
    });
    return sorted;
}

function filterEligibleQuests(basePlayer, comparisonPlayer) {
    let eligibleQuests = [];
    basePlayer.notCompleted.forEach(quest => {
    if (comparisonPlayer.completed.includes(quest)) {
        eligibleQuests.push(quest);
    }});
    return eligibleQuests;
    
}