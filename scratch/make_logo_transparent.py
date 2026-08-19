from PIL import Image

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        r, g, b, a = item
        # If pixel is light background (white/gray checkered pattern where r,g,b are close and light)
        if r > 180 and g > 180 and b > 180:
            new_data.append((0, 0, 0, 0)) # Make pixel fully transparent
        elif r > 150 and g > 150 and b > 150 and abs(r - g) < 20 and abs(g - b) < 20:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed {input_path} -> {output_path}")

process_logo(
    r"C:\Users\Pablo\.gemini\antigravity-ide\brain\75d60ead-53bf-4dd6-9a0d-901619f9edee\media__1787152935047.jpg",
    r"c:\Users\Pablo\Desktop\DPQ\web\public\assets\logos\logo_dpq_transparent.png"
)
