![novaJS](icon.png "NovaJS")

# 🚀 novaJS

**Fast, robust, secure, and simple way to integrate your webOS apps, or teach Linux development**

**This project is associated with the [ADSL license](LICENSE)**

---

## 📋 Table of Contents

- [Installation](#installation)
- [Requirements](#requirements)
- [Features](#features)
- [Usage](#usage)
- [Commands](#commands)
- [Examples](#examples)
- [License](#license)

## 📦 Installation

### Via NPM

```bash
npm install @zarcotech/novajs
```

### Via PNPM

```bash
pnpm install @zarcotech/novajs
```

### Via Git Clone

```bash
git clone https://github.com/Zarcotech/novaJS.git
cd novaJS
npm install
```

### Prerequisites

- ✅ Node.js (v14+)
- ✅ npm or pnpm
- ✅ git (for cloning)

## 📚 Requirements

NovaJS depends on these awesome packages:

| Package | Purpose |
|---------|---------|
| 🎨 [chalk](https://github.com/chalk/chalk) | Terminal string styling |
| 🌐 [express](https://github.com/expressjs/express) | Web server framework |
| 📝 [figlet](https://github.com/scottgonzalez/figlet-js) | ASCII art text |
| 📖 [readline](https://github.com/sailfishos-mirror/readline) | Terminal input handling |
| ⌨️ [readline-sync](https://github.com/anseki/readline-sync) | Synchronous readline |
| 💻 [systeminformation](https://github.com/sebhildebrandt/systeminformation) | System info retrieval |

**Note:** All dependencies are automatically installed when you install novaJS via npm/pnpm

## ✨ Features

- 🖥️ **Web-based Terminal UI** - Browser-accessible terminal at `http://localhost:3000/nova/terminal`
- 💻 **CLI Terminal** - Full-featured command-line interface
- 🎨 **Colored Output** - Syntax-highlighted file listings and output
- 📁 **File Management** - ls, cd, pwd, mkdir, rmdir, touch, rm, cat, echo
- 📊 **System Info** - Fetch device and system information
- ✏️ **Nile Editor** - Built-in simple file editor
- 🔒 **Secure** - No direct system shell passthrough (browser-safe)
- 🎯 **Lightweight** - Minimal dependencies, easy integration
- 🌐 **MIME Type Support** - Proper CSS, HTML, and asset serving

## 🎮 Usage

### As a Dependency

```javascript
import terminal from '@zarcotech/novajs';

// Start on default port 3000
terminal();

// Or specify a custom port
terminal(8080);
```

### Standalone

```bash
npm install @zarcotech/novajs
node -e "import('@zarcotech/novajs').then(m => m.default(3000))"
```

Then open your browser to:
```
http://localhost:3000/nova/terminal
```

### CLI Usage

```bash
node test.js
```

Then use the terminal commands directly in your console.

## 🛠️ Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `help` | `help` | Display all available commands |
| `ls` | `ls` | List files in current directory |
| `pwd` | `pwd` | Print working directory |
| `cd` | `cd <directory>` | Change directory |
| `mkdir` | `mkdir <dirname>` | Create a new directory |
| `rmdir` | `rmdir <dirname>` | Remove directory |
| `touch` | `touch <filename>` | Create empty file |
| `rm` | `rm <filename>` | Remove file |
| `cat` | `cat <filename>` | Display file contents |
| `echo` | `echo <text>` | Display text |
| `nile` | `nile <filename>` | Open Nile text editor |
| `fetchdev` | `fetchdev` | Show system information |
| `clear/cls` | `clear` | Clear terminal screen |
| `exit` | `exit` | Exit the terminal |

## 💡 Examples

### Create and Edit a File

```bash
$ touch myfile.txt
Created file: myfile.txt

$ nile myfile.txt
--- Nile Editor ---
(Edit your content)
SAVE
File 'myfile.txt' saved and closed.

$ cat myfile.txt
(Your content appears here)
```

### Navigate Directories

```bash
$ pwd
/home/user/projects

$ mkdir new-project
Created directory: new-project

$ cd new-project
/home/user/projects/new-project

$ ls
(Lists files in current directory)
```

### System Information

```bash
$ fetchdev
Fetching Device Info...
CPU: Intel Core i7
OS: Windows
RAM: 16 GB
Architecture: x64
Platform: win32
Node Version: v18.0.0
```

## 🔧 Advanced Configuration

### Custom Port

```javascript
import terminal from '@zarcotech/novajs';
terminal(9000); // Runs on port 9000
```

### In Express App

```javascript
import express from 'express';
import terminal from '@zarcotech/novajs';

const app = express();

// Start novaJS on port 3000 in the background
terminal(3000);

// Your other express routes
app.get('/', (req, res) => res.send('Main App'));

app.listen(8000, () => console.log('Main app on port 8000'));
```

## 📄 License

This project is licensed under the **Amazon Digital Services License (ADSL)**.
See [LICENSE](LICENSE) for details.

**Key Points:**
- ✅ Non-commercial use allowed
- ✅ Academic and educational use permitted
- ❌ Commercial use restricted
- ❌ No warranty provided

## 👨‍💻 Author

**Zarcotech** - [GitHub](https://github.com/Zarcotech)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a [Pull Request](https://github.com/Zarcotech/pulls).

## 🐛 Issues

Found a bug? Open an issue on [GitHub Issues](https://github.com/Zarcotech/novaJS/issues)

## 📞 Support

For questions or support, please visit our [GitHub repository](https://github.com/Zarcotech/novaJS)

---

**Made with ❤️ by Zarcotech**