# Rikaz — الواجهة (Frontend)

مشروع **الواجهة فقط** على `http://localhost:3000` — لا يتصل بقاعدة البيانات مباشرة.

كل عمليات البيانات (قراءة/كتابة/تسجيل دخول) تتم عبر **`api_project`** على المنفذ `3001`.

## التشغيل

### الطريقة 1 — نافذتان

```powershell
# نافذة 1 — خادم البيانات (إجباري)
cd "d:\new project\api_project"
npm run dev

# نافذة 2 — الواجهة
cd "d:\new project\rikaz_project"
npm run dev
```

### الطريقة 2 — أمر واحد

```powershell
cd "d:\new project\rikaz_project"
npm run dev:all
```

## مهم جداً

1. **أوقف** أي `npm run dev` قديم قبل التشغيل (Ctrl+C في كل نافذة).
2. إذا ظهرت بيانات والـ API متوقف، فغالباً خادم **قديم** ما زال يعمل على المنفذ 3000.
3. امسح الكاش عند الشك: احذف مجلد `.next` ثم أعد `npm run dev`.

## الهيكل

```
localhost:3000  →  rikaz_project  (صفحات + وكيل /api/*)
localhost:3001  →  api_project      (قاعدة البيانات + كل الـ API)
```

## الإعداد

انسخ `.env.example` إلى `.env.local` — لا تضف بيانات MySQL هنا.

بيانات قاعدة البيانات في `api_project/.env` فقط.
