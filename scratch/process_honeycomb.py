from PIL import Image, ImageOps, ImageEnhance

def process_honeycomb_high_visibility():
    input_path = r"c:\Users\Pablo\Desktop\DPQ\web\public\assets\bg_honeycomb.png"
    output_path = r"c:\Users\Pablo\Desktop\DPQ\web\public\assets\bg_honeycomb_inverted.png"

    img = Image.open(input_path).convert("L") # convert to grayscale
    
    # Enhance contrast heavily so grid lines are sharp and crisp
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(3.0)

    inverted = ImageOps.invert(img) # invert lines so grid is bright on dark background

    # Convert to RGBA
    img_rgba = inverted.convert("RGBA")
    datas = img_rgba.get_flattened_data() if hasattr(img_rgba, 'get_flattened_data') else img_rgba.getdata()

    new_data = []
    for item in datas:
        r, g, b, a = item
        # If it's a grid line pixel
        if r > 20:
            # Bright cyan/white lines (0, 210, 255) with high alpha
            alpha = min(255, int(r * 2.2))
            new_data.append((50, 210, 255, alpha))
        else:
            new_data.append((0, 0, 0, 0))

    img_rgba.putdata(new_data)
    img_rgba.save(output_path, "PNG")
    print(f"High visibility honeycomb pattern saved to {output_path}")

process_honeycomb_high_visibility()
