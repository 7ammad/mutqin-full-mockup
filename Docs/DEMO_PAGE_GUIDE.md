# Demo Page Guide

## Access the Demo Page

Once the dev server is running, visit:

**URL:** `http://localhost:3000/demo`

---

## What You'll See

### 1. **Calendar Component** 📅
- Interactive date picker
- RTL/Arabic support
- Apple Liquid Glass styling
- Click to select dates

### 2. **QR Code Components** 📱
- **QR Code Generation:** Displays a QR code for "https://event-med.ksa"
- **QR Code Scanner:** Click "Open Scanner" to test camera-based QR scanning
  - **Note:** Requires camera permissions in browser
  - Works best on mobile devices or with webcam

### 3. **PDF Viewer** 📄
- Component ready (needs PDF file to test)
- Will be used for certificate viewing
- Includes zoom, navigation controls

### 4. **Charts** 📊
- Line Chart
- Bar Chart
- Pie Chart
- Area Chart
- All using Apple color system

---

## Testing Checklist

- [ ] Calendar displays correctly
- [ ] Calendar date selection works
- [ ] QR Code generates correctly
- [ ] QR Scanner opens (may need camera permission)
- [ ] Charts render with sample data
- [ ] All components use Apple Liquid Glass design
- [ ] RTL/Arabic text displays correctly
- [ ] Dark mode works (toggle in header)

---

## Troubleshooting

### QR Scanner Not Working?
- Check browser camera permissions
- Try on mobile device (better camera support)
- Some browsers require HTTPS for camera access

### Calendar Not Displaying?
- Check browser console for errors
- Ensure `date-fns` is installed correctly

### Charts Not Rendering?
- Check if `recharts` is installed
- Verify data format matches expected structure

---

## Next Steps

After verifying components work:
1. Integrate Calendar into event filters
2. Use QR Code for ticket generation
3. Use QR Scanner in Event Manager check-in
4. Use PDF Viewer for certificates
5. Use Charts in analytics dashboards


