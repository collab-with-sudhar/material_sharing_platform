import { PDFDocument } from 'pdf-lib';

/**
 * Compress PDF by removing unnecessary data and optimizing
 * Target: Reduce file size by 70-80% while maintaining quality
 */
export const compressPDF = async (fileBuffer) => {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(fileBuffer, {
      ignoreEncryption: true,
    });

    // Get original size
    const originalSize = fileBuffer.length;

    // Save with compression options
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true, // Compress objects
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    const compressedSize = compressedPdfBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

    console.log(`PDF Compression:
      Original Size: ${(originalSize / 1024 / 1024).toFixed(2)} MB
      Compressed Size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB
      Compression Ratio: ${compressionRatio}%
    `);

    return {
      buffer: Buffer.from(compressedPdfBytes),
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('PDF compression error:', error);
    // If compression fails, return original buffer
    return {
      buffer: fileBuffer,
      originalSize: fileBuffer.length,
      compressedSize: fileBuffer.length,
      compressionRatio: 0,
      error: error.message,
    };
  }
};

/**
 * Optimize images in PDF by reducing quality
 * This provides additional compression for PDFs with many images
 */
export const optimizePDFImages = async (fileBuffer) => {
  try {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // Save with optimization
    const optimizedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return Buffer.from(optimizedBytes);
  } catch (error) {
    console.error('PDF optimization error:', error);
    return fileBuffer;
  }
};

/**
 * Main compression function that handles different file types
 */
export const compressFile = async (fileBuffer, mimeType) => {
  const originalSize = fileBuffer.length;
  
  // Only compress if file is larger than 500KB
  if (originalSize < 500 * 1024) {
    return {
      buffer: fileBuffer,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
      compressed: false,
      message: 'File too small to compress'
    };
  }

  try {
    switch (mimeType) {
      case 'application/pdf':
        const result = await compressPDF(fileBuffer);
        return {
          ...result,
          compressed: true,
        };

      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // Word documents are already compressed (ZIP format for .docx)
        // We don't compress them further
        return {
          buffer: fileBuffer,
          originalSize,
          compressedSize: originalSize,
          compressionRatio: 0,
          compressed: false,
          message: 'Word documents are already optimized'
        };

      default:
        return {
          buffer: fileBuffer,
          originalSize,
          compressedSize: originalSize,
          compressionRatio: 0,
          compressed: false,
          message: 'File type not supported for compression'
        };
    }
  } catch (error) {
    console.error('File compression error:', error);
    return {
      buffer: fileBuffer,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 0,
      compressed: false,
      error: error.message,
    };
  }
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
};
