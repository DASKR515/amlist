#!/usr/bin/env bash
# نسخ كل ملفات المشروع إلى صورة OBB واحدة (يتم اكتشافها تلقائيًا)
# يعمل في Termux / أي بيئة Bash مع mtools مُثبَّتة.

set -euo pipefail

SCRIPT=$(basename "$0")              # start.sh أو أي اسم تعطيه للسكربت
SRC_ROOT="${1:-$(pwd)}"              # المجلد الذي يحتوي الملفات
OBB_IMAGE="${2:-}"                   # مسار OBB (اختياري كوسيط ثانٍ)

# === 1) اكتشاف ملف .obb إن لم يُمرَّر كوسيط ===
if [[ -z "$OBB_IMAGE" ]]; then
    OBB_IMAGE=$(find "$SRC_ROOT" -maxdepth 1 -type f -iname "*.obb" | head -n 1)
fi
if [[ -z "$OBB_IMAGE" ]]; then
    echo "❌ لم يتم العثور على أي ملف ‎.obb‎ في $SRC_ROOT" >&2
    exit 1
fi
echo "📦 استخدام الصورة: $OBB_IMAGE"

# === 2) الدوران على كل الملفات ونسخها ===
find "$SRC_ROOT" -type f \
     ! -name "$(basename "$OBB_IMAGE")" \
     ! -name "$SCRIPT" |
while read -r src; do
    rel_path="${src#$SRC_ROOT/}"           # المسار النسبي (a/aa/a.png ...)
    dst="::/$rel_path"                     # الوجهة داخل الـ OBB
    dst_dir="::/$(dirname "$rel_path")"    # المجلد داخل الـ OBB

    # 2-أ) أنشئ المجلدات داخل الصورة (-s = أنشئ كل التفرعات اللازمة)
    mmd -i "$OBB_IMAGE" -s "$dst_dir" 2>/dev/null || true

    # 2-ب) انسخ الملف (-o = اكتب فوق الموجود إن وُجد)
    echo "➡️ ‎$rel_path‎ → ‎$dst"
    mcopy -o -i "$OBB_IMAGE" "$src" "$dst"
done

echo "✅ تم استبدال جميع الملفات داخل ‎$(basename "$OBB_IMAGE")‎"
