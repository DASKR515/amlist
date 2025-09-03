#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m' # No Color

# --- حذف ملفات amlist القديمة أولًا ---
echo -e "${GREEN}[+] Removing any previous amlist installation...${NC}"
rm -rf ~/.amlist
if command -v amlist &>/dev/null; then
    rm -f $(command -v amlist)
fi

# --- دوال تثبيت حسب البيئة ---
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
        echo -e "\033[0;31m[!] This script requires sudo privileges.\033[0m"
        exit 1
    fi
    sudo pacman -Sy --noconfirm
    sudo pacman -S --noconfirm git nodejs npm
}

function install_debian() {
    echo -e "${GREEN}[+] Detected Debian/Ubuntu environment${NC}"
    if ! sudo -v &>/dev/null; then
        echo -e "\033[0;31m[!] This script requires sudo privileges.\033[0m"
        exit 1
    fi
    sudo apt update -y
    sudo apt install -y git nodejs
}

# --- تحديد البيئة ---
if [ -n "$ANDROID_ROOT" ] && [ -n "$PREFIX" ]; then
    install_termux
    BIN_DIR="$PREFIX/bin"
elif command -v pacman &>/dev/null; then
    install_arch
    BIN_DIR="/usr/local/bin"
elif command -v apt &>/dev/null; then
    install_debian
    BIN_DIR="/usr/local/bin"
else
    echo -e "\033[0;31m[!] Unsupported environment. Please use Termux, Arch, or Debian/Ubuntu.\033[0m"
    exit 1
fi

mkdir -p "$BIN_DIR"
mkdir -p ~/.amlist

# --- تحميل المشروع ---
echo -e "${GREEN}[+] Cloning amlist repository...${NC}"
git clone https://github.com/DASKR515/amlist.git ~/.amlist

# --- تثبيت الحزم المطلوبة ---
echo -e "${GREEN}[+] Installing Node.js packages...${NC}"
cd ~/.amlist || exit 1
npm install

# --- إنشاء أمر amlist ---
echo -e "${GREEN}[+] Creating amlist command...${NC}"
cat > "$BIN_DIR/amlist" << 'EOF'
#!/bin/bash

case "$1" in
    -r)
        echo -e "\033[0;32m[!] Removing amlist...\033[0m"
        rm -rf ~/.amlist
        rm -f $(command -v amlist)
        echo -e "\033[0;32mamlist has been removed.\033[0m"
        ;;
    -h)
        echo "amlist is an open-source tool to manage and synchronize anime/manga lists."
        echo "by DASKR"
        ;;
    -v)
        echo "1.0.0"
        ;;
    *)
        node ~/.amlist/main.js
        ;;
esac
EOF

chmod +x "$BIN_DIR/amlist"

echo -e "${GREEN}[✓] amlist installed successfully in: $BIN_DIR/amlist${NC}"
