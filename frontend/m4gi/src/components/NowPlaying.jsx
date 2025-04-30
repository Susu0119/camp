import React, { useState, useEffect } from 'react';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function NowPlaying() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/web/api/movies/now-playing')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(console.error);
  }, []);

  return (
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {movies.map(m => (
          <div key={m.title} className="w-40 shadow-lg">
            <img
              src={`${IMAGE_BASE}${m.posterPath}`}
              alt={m.title}
              className="w-40 h-60 object-cover rounded"
            />
            <h3 className="text-center mt-2">{m.title}</h3>
          </div>
        ))}
      </div>
    );
}
