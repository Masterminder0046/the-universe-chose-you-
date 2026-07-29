from PIL import Image
import sys
import os

def remove_green_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        # If green is dominant, remove it
        if g > r + 30 and g > b + 30:
            new_data.append((0, 0, 0, 0))
        elif g > r and g > b and g > 150:
            # edge blending
            alpha = int(255 * (1 - (g - max(r, b)) / 255.0))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    
    # ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_green_background(sys.argv[1], sys.argv[2])
