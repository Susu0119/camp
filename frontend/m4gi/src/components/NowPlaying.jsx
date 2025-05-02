import React, { useState, useEffect } from 'react';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function NowPlaying() {
  const [movies, setMovies] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch('/web/api/movies/now-playing')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(console.error);
  }, []);

  return (
    <>
      {/* 영화 리스트 */}
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {movies.map(m => {
          const url = `${IMAGE_BASE}${m.posterPath}`;
          return (
            <div key={m.title} className="w-40 shadow-lg">
              <img
                src={url}
                alt={m.title}
                className="w-40 h-60 object-cover rounded cursor-pointer"
                onClick={() => setSelectedImage(url)}
              />
              <h3 className="text-center mt-2">{m.title}</h3>
            </div>
          );
        })}
      </div>

      {/* 모달 팝업 */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
