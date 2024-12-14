async function promptUser(rl, question = '\nPress Enter to return to the menu...') {
    return new Promise(resolve => rl.question('\n' + question, answer => resolve(answer)));
}

module.exports = { promptUser };