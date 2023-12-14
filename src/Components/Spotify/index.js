import { useState } from 'react';
import { Spotify } from 'react-spotify-embed';
import { CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './index.scss';

const SpotifyWiget = () => {
  const [toggle, setToogle] = useState(true);
  const toggleSpotify = () => {
    setToogle(!toggle);
  };
  /* 
  const [oEmbedData, setOEmbedData] = useState(null);
  const fetchOEmbedData = async () => {
    const response = await fetch(
      'https://open.spotify.com/playlist/2qbX2bg93iLsSBmf1OG6Zw?go=1&sp_cid=cb4965dcf921966c38be50b6bb0a56fb&utm_source=embed_player_p&utm_medium=desktop&nd=1',
    );
    const data = await response.json();
    setOEmbedData(data);
  };
  useEffect(() => {
    fetchOEmbedData();
  }, []);

    if (!oEmbedData) {
      return <div>Loading...</div>;
    }
    */

  return (
    <div
      className="spotify-container"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: toggle ? '25vw' : '0',
        transition: 'all 0.25s ease-out',
      }}
    >
      {/* Use embed API */}
      {/* <div dangerouslySetInnerHTML={{ __html: oEmbedData.html }} /> */}

      {/* Use library */}

      <div
        className="spotify-container"
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: toggle ? '25vw' : '0',
          transition: 'all 0.25s ease-out',
        }}
      >
        <Spotify
          link="https://open.spotify.com/artist/0dgJbQ0bKPyUXco8hEXN7X"
          width="100%"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          wide
        />
      </div>

      <div
        className="toogle"
        onClick={toggleSpotify}
        style={{
          position: 'absolute',
          right: '-15px',
          top: '0',
        }}
      >
        {toggle ? <CloseOutlined /> : <ArrowRightOutlined />}
      </div>
    </div>
  );
};
export default SpotifyWiget;
