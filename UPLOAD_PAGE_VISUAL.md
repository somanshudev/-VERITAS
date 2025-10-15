# 📸 Upload / Scan Page - Visual Guide

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    UPLOAD / SCAN IC                          │
│        Upload an image or capture via camera for             │
│              instant verification                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ℹ️  Tip: Use clear images for best results. Ensure good    │
│     lighting and sharp focus.                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                  ┌─────────────────────┐                    │
│                  │    📤 (pulsing)     │                    │
│                  └─────────────────────┘                    │
│                                                              │
│              Drag & Drop Image Here                          │
│           or choose from the options below                   │
│                                                              │
│        ┌──────────────┐  ┌──────────────┐                  │
│        │ 📄 Choose    │  │ 📷 Capture   │                  │
│        │    File      │  │    Photo     │                  │
│        └──────────────┘  └──────────────┘                  │
│                                                              │
│         Supported: JPG, PNG, WEBP • Max 10MB                │
│                                                              │
│  ─────────────────────────────────────────────────────      │
│                                                              │
│  IC Part Number (Optional)                                   │
│  ┌────────────────────────────────────────────────┐        │
│  │ e.g., TPS54360DDAR                             │        │
│  └────────────────────────────────────────────────┘        │
│  Providing the part number can improve verification         │
│  accuracy                                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ℹ️  Tips for Best Results                                   │
│                                                              │
│  ✅ Ensure the IC marking is clearly visible and in focus   │
│  ✅ Use good lighting - avoid shadows and glare             │
│  ✅ Capture the entire IC chip in the frame                 │
│  ✅ Use high-resolution images for better accuracy          │
└─────────────────────────────────────────────────────────────┘
```

---

## After Image Upload

```
┌─────────────────────────────────────────────────────────────┐
│                    UPLOAD / SCAN IC                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                          [X] │
│                                                              │
│                  [  IMAGE PREVIEW  ]                         │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📄  image_name.jpg                              ✅         │
│      2.45 MB                                                 │
└─────────────────────────────────────────────────────────────┘

  IC Part Number (Optional)
  ┌────────────────────────────────────────────────┐
  │ TPS54360DDAR                                   │
  └────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   📤 Upload & Verify                         │
└─────────────────────────────────────────────────────────────┘
```

---

## During Upload (Progress Bar)

```
┌─────────────────────────────────────────────────────────────┐
│  ⟳ Analyzing IC marking...                            65%   │
│  ████████████████████░░░░░░░░░░░                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Please wait while we analyze your IC marking...             │
└─────────────────────────────────────────────────────────────┘
```

---

## Drag & Drop Active State

```
┌─────────────────────────────────────────────────────────────┐
│ ╔═════════════════════════════════════════════════════════╗ │
│ ║                                                         ║ │
│ ║              ┌─────────────────────┐                   ║ │
│ ║              │    📤 (pulsing)     │                   ║ │
│ ║              └─────────────────────┘                   ║ │
│ ║                                                         ║ │
│ ║          Drag & Drop Image Here                        ║ │
│ ║       or choose from the options below                 ║ │
│ ║                                                         ║ │
│ ║    [Choose File]  [Capture Photo]                      ║ │
│ ║                                                         ║ │
│ ╚═════════════════════════════════════════════════════════╝ │
│         (Blue border, light blue background, scaled up)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile View

```
┌──────────────────────┐
│   UPLOAD / SCAN IC   │
│                      │
│  Upload an image or  │
│  capture via camera  │
└──────────────────────┘

┌──────────────────────┐
│ ℹ️  Tip: Use clear  │
│  images for best     │
│  results...          │
└──────────────────────┘

┌──────────────────────┐
│                      │
│    📤 (pulsing)      │
│                      │
│  Drag & Drop Image   │
│                      │
│ ┌──────────────────┐ │
│ │  📄 Choose File  │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ 📷 Capture Photo │ │
│ └──────────────────┘ │
│                      │
│  JPG, PNG • Max 10MB │
│                      │
│  Part Number         │
│ ┌──────────────────┐ │
│ │ e.g., TPS543...  │ │
│ └──────────────────┘ │
└──────────────────────┘

┌──────────────────────┐
│ ℹ️  Tips for Best   │
│     Results          │
│                      │
│ ✅ Clear & visible   │
│ ✅ Good lighting     │
│ ✅ Full chip frame   │
│ ✅ High resolution   │
└──────────────────────┘
```

---

## Animation Sequence

### 1. Initial Load
```
Upload icon: Gentle pulse (fade in/out)
Border: Gray dashed
Background: White
```

### 2. Hover
```
Border: Changes to blue
Background: Light gray
Cursor: Pointer
```

### 3. Drag Over
```
Border: Solid blue
Background: Light blue
Scale: 105%
Transition: Smooth 300ms
```

### 4. Image Loaded
```
Preview: Fade in
Success box: Slide in from bottom
Checkmark: Pop in
```

### 5. Upload Progress
```
Progress bar: 0% → 100%
Percentage: Updates every 200ms
Spinner: Continuous rotation
Bar fill: Smooth transition
Pulse effect: On progress bar
```

---

## Color States

### Upload Zone
```
Normal:
  Border: #d1d5db (gray-300)
  Background: white
  Icon: #dbeafe (primary-100)

Hover:
  Border: #93c5fd (primary-400)
  Background: #f9fafb (gray-50)

Drag Active:
  Border: #3b82f6 (primary-500)
  Background: #eff6ff (primary-50)
  Scale: 1.05
```

### Success State
```
Box: #f0fdf4 (green-50)
Border: #bbf7d0 (green-200)
Icon bg: #dcfce7 (green-100)
Icon: #16a34a (green-600)
Checkmark: #16a34a (green-600)
```

### Progress Bar
```
Track: #e5e7eb (gray-200)
Bar: Gradient #3b82f6 → #2563eb
Overlay: white 20% opacity
Text: #2563eb (primary-600)
Spinner: #2563eb (primary-600)
```

---

## Interactive Elements

### Buttons
```
Primary (Choose File):
  Normal: Blue bg, white text
  Hover: Darker blue, shadow increase
  Active: Pressed effect

Secondary (Capture Photo):
  Normal: White bg, blue border
  Hover: Light blue bg
  Active: Pressed effect
```

### Remove Button
```
Normal: Red bg, white icon
Hover: Darker red, scale 110%
Active: Pressed, scale 95%
Shadow: Increases on hover
```

### Input Field
```
Normal: Gray border
Focus: Blue border, outline removed
Disabled: Gray bg, reduced opacity
```

---

## User Experience Flow

```
1. User arrives
   ↓
2. Sees clear upload options
   ↓
3. Chooses method:
   - Drag & drop
   - Choose file
   - Capture photo
   ↓
4. Image preview appears
   ↓
5. (Optional) Adds part number
   ↓
6. Clicks "Upload & Verify"
   ↓
7. Progress bar animates
   ↓
8. "Analyzing IC marking..." shows
   ↓
9. Redirects to results (2.5s)
```

---

## Accessibility Features

✅ **Keyboard Navigation**
- Tab through all interactive elements
- Enter/Space to activate buttons
- Focus indicators visible

✅ **Screen Reader Support**
- Semantic HTML
- Alt text on images
- ARIA labels where needed
- Clear button text

✅ **Touch Targets**
- Minimum 44x44px
- Adequate spacing
- Large tap areas

✅ **Visual Feedback**
- Clear hover states
- Active states
- Disabled states
- Progress indicators

---

## Performance

⚡ **Fast Loading**
- Minimal JavaScript
- Optimized images
- CSS animations (GPU accelerated)

⚡ **Smooth Animations**
- 60fps target
- Hardware acceleration
- Efficient transitions

⚡ **Responsive**
- Instant feedback
- No lag on interactions
- Quick file processing

---

**The Upload/Scan page is now complete and ready to use! 📸**
