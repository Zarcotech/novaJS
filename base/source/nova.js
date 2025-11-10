import os from 'os'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
import chalk from 'chalk'
import figlet from 'figlet'
import si from 'systeminformation'
import { execSync } from 'child_process'
import { error } from 'console'
import express from 'express';
import { fileURLToPath } from 'url'

function clearScreen() {
    process.stdout.write('\x1Bc')
}

async function nileEditor(filename) {
    console.log(chalk.cyan('--- Nile Editor ---'))
    console.log(chalk.yellow(`Editing file: ${filename}`))
    console.log(chalk.magenta("Type 'SAVE' on a new line to save and exit."))
    let content = []
    if (fs.existsSync(filename)) {
        content = fs.readFileSync(filename, 'utf-8').split('\n')
        console.log(chalk.green('File loaded. Current content:'))
        content.forEach((line, i) => console.log(`${String(i + 1).padStart(4)} | ${line}`))
    } else console.log(chalk.green('New file.'))
    console.log('-'.repeat(20))
    console.log("Start typing below (type 'SAVE' on its own line to finish):")
    const rl = readline.createInterface({ input: process.stdin, output: { write: () => {} } })
    let newContent = []
    for await (const line of rl) {
        console.log(line)
        const trimmed = line.trim().toUpperCase()
        if (trimmed === 'SAVE') {
            break
        }
        newContent.push(line)
    }
    rl.close()
    fs.writeFileSync(filename, newContent.join('\n'))
    console.log(chalk.cyan(`File '${filename}' saved and closed.`))
}

async function terminal(PORT = 3000) {

    const app = express();

    const __dirname = fileURLToPath(new URL('.', import.meta.url));

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    app.use('/nova', express.static(path.join(__dirname, '../templates'), {
        setHeaders: (res, filePath) => {
            const ext = path.extname(filePath).toLowerCase();
            if (mimeTypes[ext]) {
                res.setHeader('Content-Type', mimeTypes[ext]);
            }
        }
    }));

    const staticDir = path.join(__dirname, '../static');
    if (fs.existsSync(staticDir)) {
        app.use('/nova', express.static(staticDir, {
            setHeaders: (res, filePath) => {
                const ext = path.extname(filePath).toLowerCase();
                if (mimeTypes[ext]) {
                    res.setHeader('Content-Type', mimeTypes[ext]);
                }
            }
        }));
    }
    
    if (PORT == undefined) {
        console.log(chalk.red("novaJS: ERROR STARTING TERMINAL: NO PORT SPECIFIED"));
    
    } else {
        app.get('/nova/terminal', (req, res) => {
            res.sendFile(path.join(__dirname, '../templates/index.html'));
        })

        app.listen(PORT, () => {
            console.log(`\n NovaJS terminal running on http://localhost:${PORT}/nova/terminal`);
            prompt();
        })
    }

    
    
    const userName = 'user'
    const computerName = os.hostname()
    const customFig = figlet.textSync('Nova JS', { font: 'Slant' })
    const customCommands = {}
    async function handleCommand(input) {
        const inputSplit = input.trim().split(' ');
        const intake = inputSplit[0];
        let result = '';
        let meta = undefined;
        try {
            if (intake === 'ls') {
                const files = fs.readdirSync('.').map(f => ({
                    name: f,
                    type: fs.lstatSync(f).isDirectory() ? 'dir' : 'file'
                }));
                result = files.map(f => f.name).join('\n');
                meta = { files };
            } else if (intake === 'pwd') {
                result = process.cwd();
            } else if (intake === 'cd') {
                if (!inputSplit[1]) result = 'Usage: cd <directory>';
                else { process.chdir(inputSplit[1]); result = process.cwd(); }
            } else if (intake === 'touch') {
                if (!inputSplit[1]) result = 'Usage: touch <filename>';
                else { fs.writeFileSync(inputSplit[1], ''); result = `Created file: ${inputSplit[1]}`; }
            } else if (intake === 'mkdir') {
                if (!inputSplit[1]) result = 'Usage: mkdir <dirname>';
                else { fs.mkdirSync(inputSplit[1]); result = `Created directory: ${inputSplit[1]}`; }
            } else if (intake === 'rm') {
                if (!inputSplit[1]) result = 'Usage: rm <filename>';
                else if (!fs.existsSync(inputSplit[1])) result = `Error: file '${inputSplit[1]}' not found`;
                else { fs.unlinkSync(inputSplit[1]); result = `Removed file: ${inputSplit[1]}`; }
            } else if (intake === 'rmdir') {
                if (!inputSplit[1]) result = 'Usage: rmdir <dirname>';
                else if (!fs.existsSync(inputSplit[1]) || !fs.lstatSync(inputSplit[1]).isDirectory()) result = `Error: directory '${inputSplit[1]}' not found or not a directory`;
                else { fs.rmdirSync(inputSplit[1]); result = `Removed directory: ${inputSplit[1]}`; }
            } else if (intake === 'cat') {
                if (!inputSplit[1]) result = 'Usage: cat <filename>';
                else result = fs.readFileSync(inputSplit[1], 'utf-8');
            } else if (intake === 'echo') {
                result = inputSplit.slice(1).join(' ') || 'Usage: echo <text>';
            } else if (intake === 'clear' || intake === 'cls') {
                result = '\x1Bc';
            } else if (intake === 'nile') {
                if (!inputSplit[1]) result = 'Usage: nile <filename>';
                else { await nileEditor(inputSplit[1]); result = `Edited file: ${inputSplit[1]}`; }
            } else if (intake === 'fetchdev') {
                const cpu = await si.cpu();
                const mem = await si.mem();
                result = `CPU: ${cpu.brand}\nOS: ${os.type()}\nRAM: ${Math.round(mem.total / (1024 ** 3))} GB\nArch: ${os.arch()}\nRelease: ${os.release()}\nPlatform: ${os.platform()}\nNode Version: ${process.version}`;
            } else if (intake === 'help') {
                result = `help - Displays this list
exit - Exits the terminal
ls - Lists files
pwd - Prints working directory
cd - Changes directory
touch - Creates file
mkdir - Creates directory
rm - Removes file
rmdir - Removes directory
cat - Displays file content
clear/cls - Clears screen
nile - File editor (Usage: nile <filename>)
fetchdev - Shows device info
custom - Save command from file (Usage: custom <filename>)`;
            } else if (intake === 'exit') {
                result = 'Exiting...';
            } else {
                result = 'Command not found. Type "help" to see available commands.';
            }
        } catch (err) {
            result = 'Error: ' + err.message;
        }
        return { result, meta };
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '' });
    async function prompt() {
        const dir = process.cwd();
        rl.question(chalk.green(userName) + '@' + chalk.blue(computerName) + ':~' + chalk.white(dir) + ' $ ', async (input) => {
            const { result } = await handleCommand(input);
            if (result === '\x1Bc') clearScreen();
            else if (result === 'Exiting...') { rl.close(); console.log('Exiting...'); return; }
            else console.log(result);
            prompt();
        });
    }

    app.use(express.json());
    app.post('/nova/command', async (req, res) => {
        const { cmd } = req.body || {};
        if (!cmd || typeof cmd !== 'string') return res.status(400).json({ error: 'missing command' });
        const { result, meta } = await handleCommand(cmd);
        res.json({ stdout: result, meta });
    });
}

export default terminal;