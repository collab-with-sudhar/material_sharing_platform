from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pymupdf
import io
import math
from PIL import Image

app = FastAPI(title="PDF Compression Service")

# CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def compress_pdf_document(file_content: bytes) -> tuple[bytes, int, int]:
    """
    Compresses a PDF document.
    Returns: (compressed_bytes, original_size, compressed_size)
    """
    original_size = len(file_content)

    try:
        doc = pymupdf.open(stream=file_content, filetype="pdf")

        # Optimize each page
        for page_num in range(len(doc)):
            page = doc[page_num]
            image_list = page.get_images(full=True)

            # Iterate through images on the page
            for img_info in image_list:
                xref = img_info[0]

                # Get image properties
                try:
                    base_image = doc.extract_image(xref)
                except Exception:
                    continue

                if not base_image:
                    continue

                image_bytes = base_image["image"]
                width = base_image["width"]
                height = base_image["height"]
                ext = base_image["ext"]
                colorspace = base_image.get("colorspace", 0)

                # Skip small images or already small files
                if width < 1000 and height < 1000:
                    continue

                if len(image_bytes) < 100 * 1024:  # Skip < 100KB
                    continue

                # Open with Pillow
                try:
                    pil_image = Image.open(io.BytesIO(image_bytes))

                    # Calculate new dimensions (max 1200px wide)
                    MAX_WIDTH = 1200
                    if width > MAX_WIDTH:
                        ratio = MAX_WIDTH / width
                        new_height = int(height * ratio)
                        pil_image = pil_image.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)

                        # Convert to JPEG
                        if pil_image.mode != "RGB":
                            pil_image = pil_image.convert("RGB")

                        # Save to buffer
                        img_buffer = io.BytesIO()
                        pil_image.save(img_buffer, format="JPEG", quality=60, optimize=True)
                        new_image_bytes = img_buffer.getvalue()

                        # Only replace if smaller
                        if len(new_image_bytes) < len(image_bytes):
                            # Replace image in PDF
                            doc.update_stream(xref, new_image_bytes)
                except Exception as e:
                    print(f"Failed to process image {xref}: {e}")
                    continue

        # Save with garbage collection and deflation
        out_buffer = io.BytesIO()
        doc.ez_save(out_buffer)

        compressed_bytes = out_buffer.getvalue()
        compressed_size = len(compressed_bytes)

        doc.close()

        return compressed_bytes, original_size, compressed_size

    except Exception as e:
        print(f"Compression error: {e}")
        raise e

@app.post("/compress")
async def compress_endpoint(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        content = await file.read()
        compressed_content, original_size, compressed_size = compress_pdf_document(content)

        return Response(
            content=compressed_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="compressed_{file.filename}"',
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
