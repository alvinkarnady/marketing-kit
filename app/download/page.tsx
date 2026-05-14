'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function DownloadContent() {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const url = searchParams.get('url');
    if (url) {
      setImageUrl(decodeURIComponent(url));
    }
  }, [searchParams]);

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      setIsDownloading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Piawai_Photobooth_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Foto dari Piawai Photobooth',
          text: 'Lihat hasil fotoku dari Piawai Photobooth!',
          url: window.location.href, // Share the current page URL
        });
      } else {
        alert('Fitur share tidak didukung di browser ini.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!imageUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white p-6">
        <p className="text-white/60">Sedang memuat foto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Background blurred image for cool effect */}
      <div 
        className="absolute inset-0 z-0 opacity-30 blur-3xl scale-110"
        style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      />
      
      <div className="z-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-8 text-center mt-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Piawai Photobooth
          </h1>
          <p className="text-white/70 text-sm">Terima kasih telah berpartisipasi!</p>
        </div>

        {/* Photo Container */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-pink-500/20 border border-white/10 mb-8 bg-black/50 backdrop-blur-sm p-4">
          <img 
            src={imageUrl} 
            alt="Photobooth Result" 
            className="w-full h-auto rounded-xl object-contain"
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4 mb-10">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4 px-6 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-70"
          >
            {isDownloading ? (
              <span>Mengunduh...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Simpan ke Galeri
              </>
            )}
          </button>
          
          <button
            onClick={handleShare}
            className="w-full py-4 px-6 bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Bagikan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white p-6">
        <p className="text-white/60">Memuat halaman...</p>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}
