

# ![AMLIST Logo](https://raw.githubusercontent.com/DASKR515/amlist/main/logo.jpg) AMLIST

**AMLIST** is an open-source TUI tool designed to manage and synchronize your anime and manga lists from [MyAnimeList](https://myanimelist.net) and other sources using [Consumet](https://github.com/consumet).

It supports multi-source fetching for **anime** and **manga**, and provides:

- Search by name
- List top 10
- Filter by letters (A-Z)
- Multi-page navigation in terminal
- Clean TUI with green theme and white logo

> Coming soon: full support for Debian packages and more platforms.

---

## Installation

### Termux & Arch Linux

For **Termux**, **Arch Linux**, and **Debian/Ubuntu**:

```bash
curl -s https://raw.githubusercontent.com/DASKR515/amlist/main/install.sh | bash

> The installer will:

Remove any previous ~/.amlist installation to avoid conflicts

Install required dependencies (git, nodejs, npm if needed)

Clone the latest repository

Install all Node.js packages

Create the amlist command globally





---

Usage

After installation, run:

amlist

This will launch the TUI interface where you can choose:

1 = Anime

2 = Manga

q = Quit


Command-line options

amlist -h         # Show help/about
amlist -r         # Remove amlist completely
amlist -v         # Show version
amlist -owm       # Open World Multi (experimental)
amlist -v-owm     # Show Open World Multi version


---

Features

Anime & Manga search: fetch data from multiple providers using Consumet extensions.

Top lists: view top 10 anime or manga per provider.

Alphabet filter: search by letters A-Z.

Multi-page navigation: use n for number, m for more results.

TUI design: green theme with white logo.

Lightweight: works directly in Termux or Linux terminal without a database.



---

Credits

Developed by DASKR

Powered by Consumet for anime & manga data sources.



---



> Enjoy managing your anime & manga lists in terminal! 🎉



---

✅ ما تم تعديله وإضافته:

1. توضيح كل الخصائص التي أضفناها: TUI، ثيم أخضر، شعار أبيض.  
2. شرح كيفية التثبيت على Termux وArch/Debian.  
3. توضيح الخيارات الجديدة: `-r`, `-v`, `-owm`, الخ.  
4. قسم عن الاستخدام داخل الـTUI: أزرار، التنقل، فلترة A-Z، صفحات متعددة.  
5. إضافة شعار واضح وصورة توضيحية.  
6. ذكر المصادر وشكر مكتبة Consumet.  

---

إذا أحببت، أقدر أجهز **نسخة مع الصور الحقيقية للـTUI أثناء التشغيل** بحيث يظهر في README مثال واقعي للواجهة بدل الشعار فقط، لتجعل المشروع أكثر احترافية على GitHub.  

هل تريد أن أفعل ذلك؟

