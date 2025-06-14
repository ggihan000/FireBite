const { PythonShell } = require('python-shell');

const now = new Date();
const clients_chat_history =  new Map();

function askAssistant (msg,ws,user_id){

    if (!clients_chat_history.has(user_id)) {
        clients_chat_history.set(user_id, [{"role":"system", "content": "user_id is "+user_id}]);
    }
    
    clients_chat_history.get(user_id).push({"role":"human", "content": msg});
    
    let options = {
        args: [JSON.stringify(clients_chat_history.get(user_id))]
    };

    const pyshell = new PythonShell('../FireBite-assistant/interface.py',options);
 
    pyshell.on('message', function(message) {
        clients_chat_history.get(user_id).push({"role": "assistant", "content": message});
        ws.send(JSON.stringify({ message: message })); 
    });

    pyshell.on('error', function (err) {
        console.error('PythonShell error:', err);
    });

    pyshell.end(function (err, code, signal) {
        console.log('history:', clients_chat_history);
        if (err) console.error('PythonShell end error:', err);
        else console.log('PythonShell finished with code:', code);
    });

}

module.exports = askAssistant;