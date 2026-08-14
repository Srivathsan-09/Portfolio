import os
from PIL import Image, ImageOps

IMAGES_DIR = r"d:\Web Dev\Portfolio - 2\public\images"
MAX_DIM = 1920
QUALITY = 82

supported_extensions = ('.jpg', '.jpeg', '.png', '.JPG', '.PNG', '.JPEG')

total_original_bytes = 0
total_webp_bytes = 0
converted_count = 0

print("Starting image optimization...")

for root, dirs, files in os.walk(IMAGES_DIR):
    for file in files:
        if file.lower().endswith(supported_extensions) and not file.lower().endswith('.webp'):
            input_path = os.path.join(root, file)
            file_stem = os.path.splitext(file)[0]
            output_path = os.path.join(root, file_stem + ".webp")
            
            orig_size = os.path.getsize(input_path)
            total_original_bytes += orig_size
            
            try:
                with Image.open(input_path) as img:
                    # Auto rotate based on EXIF tag if available
                    img = ImageOps.exif_transpose(img)
                    
                    # Convert to RGB if palette/RGBA for JPEG/WebP
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGBA")
                    else:
                        img = img.convert("RGB")
                    
                    # Resize if larger than MAX_DIM
                    w, h = img.size
                    if w > MAX_DIM or h > MAX_DIM:
                        img.thumbnail((MAX_DIM, MAX_DIM), Image.Resampling.LANCZOS)
                    
                    # Save as WebP
                    img.save(output_path, "WEBP", quality=QUALITY, method=6)
                    
                webp_size = os.path.getsize(output_path)
                total_webp_bytes += webp_size
                converted_count += 1
                
                reduction = ((orig_size - webp_size) / orig_size) * 100
                print(f"Compressed {file} -> {file_stem}.webp: {orig_size / 1024 / 1024:.2f}MB -> {webp_size / 1024:.1f}KB ({reduction:.1f}% saved)")
            except Exception as e:
                print(f"Error converting {file}: {e}")

print("=" * 60)
print(f"Finished converting {converted_count} images.")
if total_original_bytes > 0:
    total_saved = ((total_original_bytes - total_webp_bytes) / total_original_bytes) * 100
    print(f"Original total size: {total_original_bytes / 1024 / 1024:.2f} MB")
    print(f"WebP total size: {total_webp_bytes / 1024 / 1024:.2f} MB")
    print(f"Overall reduction: {total_saved:.1f}% space saved!")
