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

    const rl = readline.createInterface({ input: process.stdin, output: undefined })
    let newContent = []
    for await (const line of rl) {
        if (line === 'SAVE') break
        newContent.push(line)
    }
    rl.close()
    fs.appendFileSync(filename, newContent.join('\n') + '\n')
    console.log(chalk.cyan(`File '${filename}' saved and closed.`))
}

async function terminal(PORT) {

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
        })
    }

    
    
    const userName = 'user'
    const computerName = os.hostname()
    const customFig = figlet.textSync('Nova JS', { font: 'Slant' })
    const customCommands = {}

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '' })
    async function prompt() {
        const dir = process.cwd()
        rl.question(chalk.green(userName) + '@' + chalk.blue(computerName) + ':~' + chalk.white(dir) + ' $ ', async (input) => {
            const inputSplit = input.trim().split(' ')
            if (!inputSplit[0]) return prompt()
            const intake = inputSplit[0]

            const ls = () => fs.readdirSync('.').forEach(f => console.log(fs.lstatSync(f).isDirectory() ? chalk.red(f) : chalk.blue(f)))
            const pwd = () => console.log(process.cwd())
            const cd = () => inputSplit[1] ? process.chdir(inputSplit[1]) : console.log('Usage: cd <directory>')
            const touch = () => inputSplit[1] ? fs.writeFileSync(inputSplit[1], '') : console.log('Usage: touch <filename>')
            const mkdir = () => inputSplit[1] ? fs.mkdirSync(inputSplit[1]) : console.log('Usage: mkdir <dirname>')
            const rm = () => inputSplit[1] ? fs.existsSync(inputSplit[1]) ? fs.unlinkSync(inputSplit[1]) : console.log(`Error: file '${inputSplit[1]}' not found`) : console.log('Usage: rm <filename>')
            const echo = () => inputSplit[1] ? console.log(inputSplit.slice(1).join(' ')) : console.log('Usage: echo <text>')
            const rmdir = () => inputSplit[1] ? fs.existsSync(inputSplit[1]) && fs.lstatSync(inputSplit[1]).isDirectory() ? fs.rmdirSync(inputSplit[1]) : console.log(`Error: directory '${inputSplit[1]}' not found or not a directory`) : console.log('Usage: rmdir <dirname>')
            const cat = () => inputSplit[1] ? console.log(fs.readFileSync(inputSplit[1], 'utf-8')) : console.log('Usage: cat <filename>')
            const nile = async () => inputSplit[1] ? await nileEditor(inputSplit[1]) : console.log('Usage: nile <filename>')
            const custom = () => {
                if (inputSplit[1]) {
                    const customCommandFile = inputSplit[1]
                    const name = 'custom_' + path.basename(customCommandFile)
                    const cmd = fs.readFileSync(customCommandFile, 'utf-8')
                    customCommands[name] = cmd
                    console.log(`Custom command '${name}' saved for this session.`)
                } else console.log('Usage: custom <filename>')
            }
            const xclear = () => inputSplit[1] ? fs.writeFileSync(inputSplit[1], '') : null
            const fetchdev = async () => {
                const cpu = await si.cpu()
                const mem = await si.mem()
                console.log(chalk.blue('Fetching Device Info...'))
                console.log(customFig)
                console.log(`CPU: ${cpu.brand}\nOS: ${os.type()}\nRAM: ${Math.round(mem.total / (1024 ** 3))} GB\nArch: ${os.arch()}\nRelease: ${os.release()}\nPlatform: ${os.platform()}\nNode Version: ${process.version}`)
            }

            try {
                if (intake === 'exit') { rl.close(); if (rl.close()) console.log('Exiting...'); if (error) {return} }
                else if (intake === 'ls') ls()
                else if (intake === 'pwd') pwd()
                else if (intake === 'cd') cd()
                else if (intake === 'touch') touch()
                else if (intake === 'mkdir') mkdir()
                else if (intake === 'rm') rm()
                else if (intake === 'echo') echo()
                else if (intake === 'rmdir') rmdir()
                else if (intake === 'cat') cat()
                else if (intake === 'clear' || intake === 'cls') clearScreen()
                else if (intake === 'mint') console.log('Coming soon!')
                else if (intake === 'nile') await nile()
                else if (intake === 'custom') custom()
                else if (intake === 'xclear') xclear()
                else if (intake === 'fetchdev') await fetchdev()
                else if (intake === 'help') console.log(`List of Commands:
help - Displays this list
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
custom - Save command from file (Usage: custom <filename>)`)
                else if (customCommands[intake]) execSync(customCommands[intake], { stdio: 'inherit' })
                else console.log('Bash error: No Command Found')
            } catch (err) { console.log('Bash error:', err.message) }
            prompt()
        })
    }
    prompt()
}

export default terminal;