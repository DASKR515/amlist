#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m' # No Color

function install_termux() {
    echo -e "${GREEN}[+] Detected Termux environment${NC}"
    echo -e "${GREEN}[+] Updating package lists...${NC}"
    pkg update -y

    echo -e "${GREEN}[+] Installing dependencies: git, nodejs...${NC}"
    pkg install -y git nodejs
}

function install_arch() {
    echo -e "${GREEN}[+] Detected Arch Linux environment${NC}"

    if ! sudo -v &>/dev/null; then
        echo -e "\033[0;31m[!] This script requires sudo privileges. Please run as a user with sudo access.\033[0m"
        exit 1
    fi

    echo -e "${GREEN}[+] Updating package lists...${NC}"
    sudo pacman -Sy --noconfirm

    echo -e "${GREEN}[+] Installing dependencies: git, nodejs...${NC}"
    sudo pacman -S --noconfirm git nodejs
}

# Detect environment and set install path
if command -v pkg &>/dev/null; then
    install_termux
    PREFIX_DIR="$PREFIX"
    BIN_DIR="$PREFIX_DIR/bin"
else
    install_arch
    BIN_DIR="/usr/local/bin"
fi

# Ensure bin directory exists
mkdir -p "$BIN_DIR"

echo -e "${GREEN}[+] Removing old amlist directory if exists...${NC}"
rm -rf ~/.amlist

echo -e "${GREEN}[+] Creating amlist directory...${NC}"
mkdir -p ~/.amlist

echo -e "${GREEN}[+] Cloning amlist repository...${NC}"
git clone https://github.com/DASKR515/malist.git ~/.amlist

echo -e "${GREEN}[+] Installing Node.js packages...${NC}"
cd ~/.amlist
npm install

echo -e "${GREEN}[+] Creating amlist command script...${NC}"
cat > /tmp/amlist << 'EOF'
#!/bin/bash

case "$1" in
    -r)
        echo -e "\033[0;32m[!] Removing amlist...\033[0m"
        rm -rf ~/.amlist
        rm -f $(command -v amlist)
        echo -e "\033[0;32mamlist has been removed.\033[0m"
        ;;
    -h)
        echo "amlist is an open-source tool designed to manage and synchronize your anime lists from MyAnimeList and more."
        echo "by DASKR"
        ;;
    -owm)
        node ~/.amlist/More-data/index.js
        ;;
    -v)
        echo "1.0.0"
        ;;
    -v-owm)
        echo "0.1.0"
        ;;
    *)
        node ~/.amlist/main.js
        ;;
esac
EOF

# Move to correct bin directory with appropriate permissions
if [[ "$BIN_DIR" == "/usr/local/bin" ]]; then
    sudo mv /tmp/amlist "$BIN_DIR/amlist"
    sudo chmod +x "$BIN_DIR/amlist"
else
    mv /tmp/amlist "$BIN_DIR/amlist"
    chmod +x "$BIN_DIR/amlist"
fi

echo -e "${GREEN}[✓] amlist installed successfully in: $BIN_DIR/amlist${NC}"