from PIL import Image

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        # Calculate luminance or just use max of rgb
        max_val = max(r, g, b)
        
        # If the pixel is very dark, make it transparent
        if max_val < 10:
            new_data.append((0, 0, 0, 0))
        else:
            # We want smooth blending. We can map the pixel's max_val to alpha.
            # But the hand should be opaque. The hand is mostly skin tones.
            # A simple approach: 
            # Anything below a certain threshold becomes increasingly transparent.
            if max_val < 50:
                # scale alpha
                alpha = int((max_val / 50) * 255)
                new_data.append((r, g, b, alpha))
            else:
                new_data.append((r, g, b, 255))
                
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_black_background(
    r"d:\Downloads\the-universe-chose-you (1)\public\assets\cake_hand_presentation.png", 
    r"d:\Downloads\the-universe-chose-you (1)\public\assets\cake_hand_transparent.png"
)
