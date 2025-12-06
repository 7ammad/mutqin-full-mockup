# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - heading "تسجيل الدخول" [level=1] [ref=e7]
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: الدور
        - combobox [ref=e11]:
          - option "اختر الدور" [selected]
          - option "ممارس صحي"
          - option "منظم"
          - option "مزود"
          - option "جهة تنظيمية"
          - option "مدير حدث"
      - generic [ref=e12]:
        - generic [ref=e13]: البريد الإلكتروني
        - textbox "example@demo.com" [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]: كلمة المرور
        - textbox "كلمة المرور" [ref=e17]
      - button "تسجيل الدخول" [ref=e18]:
        - generic [ref=e21]: تسجيل الدخول
    - generic [ref=e22]:
      - paragraph [ref=e23]: تسجيل سريع
      - generic [ref=e24]:
        - button "ممارس صحي" [ref=e25]: ممارس صحي
        - button "منظم" [ref=e28]: منظم
        - button "مزود" [ref=e31]: مزود
        - button "جهة تنظيمية" [ref=e34]: جهة تنظيمية
        - button "مدير حدث" [ref=e37]: مدير حدث
  - button "Open Next.js Dev Tools" [ref=e45] [cursor=pointer]:
    - img [ref=e46]
  - alert [ref=e49]
```