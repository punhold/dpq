from PIL import Image, ImageEnhance

def process_molecules_tile():
    img_path = r"c:\Users\Pablo\Desktop\DPQ\web\public\assets\bg_molecules.jpg"
    out_path = r"c:\Users\Pablo\Desktop\DPQ\web\public\assets\bg_molecules_tile.png"
    
    img = Image.open(img_path).convert("RGBA")
    
    # Increase contrast and sharpness
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.8)

    enhancer_sharp = ImageEnhance.Sharpness(img)
    img = enhancer_sharp.enhance(2.0)
    
    img.save(out_path, "PNG")
    print("Molecules tile created successfully!")

process_molecules_tile()
