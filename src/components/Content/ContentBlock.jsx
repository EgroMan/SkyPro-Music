import sprite from "./sprite.svg";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React, { useContext, useEffect, useState } from "react";
import * as S from "./ContentStyle";
import { addMyTracks, delMyTracks, getTracks } from "../../api";
import { UserContext } from "../../App"
//redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTrackRedux, setTracksRedux } from "../../store/reducers/playerSlice";
import { useNavigate } from "react-router-dom";


let errorText = null;


export function Content({ status, setStatus, setPlayerOn, tracks, setTracks }) {
  const [contentVisible, setContentVisible] = useState(false);
  const [error, setError] = useState(null)
  const userName = useContext(UserContext)
  const navigate = useNavigate()




  //redux
  const activeTrackRedux = useSelector(state => state.track.activeTrack)
  const playerOnDot = useSelector(state => state.track.playerOn)
  const dispatch = useDispatch();
  const filterState = useSelector(state => state.track.filterState)
  const filterTracks = useSelector(state => state.track.tracks)

  function likes(track) {
    for (let index_user = 0; index_user < track.stared_user.length; index_user++) {
      let likName = track.stared_user[index_user].username
      let un = userName
      if (likName === un[0]) {
        return track.id
      }
    }
  }
  function renderLikes(id) {
    addMyTracks(id).then(() => renderTracks()
    ).catch((err) => {
      setError(err.message);
      setTimeout(() => navigate("/login", { replace: true }), 2000)
    })
  }
  function renderDisLikes(id) {
    delMyTracks(id).then(() => renderTracks()
    ).catch((err) => {
      setError(err.message);
    })
  }
  function renderTracks() {
    getTracks()
      .then((data) => {
        errorText = null;
        setTracks(data);
        if (!filterState) { dispatch(setTracksRedux(data)); };
        status ? setStatus(false) : setStatus(true);
        return tracks;
      })
      .catch((error) => {
        errorText = error.message;
        setContentVisible(true);
        setTracks([]);
        localStorage.removeItem('userName')
        return errorText;
      }).then(() => { setTimeout(() => setContentVisible(true), 5000) })
  }
  useEffect(() => {
    renderTracks()
  }, [
    dispatch, setTracks
  ]);
  let newTracks;
  let skeletonTracks = [
    { id: "8" },
    { id: "9" }, 
    { id: "10" }, 
    { id: "11" }, 
    { id: "12" }, 
    { id: "13" }, 
    { id: "14" }, 
    { id: "15" }
  ]
  { contentVisible ? newTracks = tracks : newTracks = skeletonTracks }
  return (
    <S.CentralBlockContent>
      {error && <h2 style={{
        color: 'red',
        alignSelf: 'center'
      }}>{error} для простановки лайков</h2>}
      <S.CentralBlock_playlistTitle>

        <S.PlaylistTitleCol01>Трек</S.PlaylistTitleCol01>
        <S.PlaylistTitleCol02>ИСПОЛНИТЕЛЬ</S.PlaylistTitleCol02>
        <S.PlaylistTitleCol03>АЛЬБОМ</S.PlaylistTitleCol03>
        <S.PlaylistTitleCol04>

          <S.Playlist__titleSvg alt="time">
            <use xlinkHref="img/icon/sprite.svg#icon-watch"></use>
          </S.Playlist__titleSvg>
        </S.PlaylistTitleCol04>
      </S.CentralBlock_playlistTitle>
      <S.CentralBlockContentPlaylist style={{ maxHeight: "800px", overflowY: "auto" }}>
        <div style={{ color: "red" }}>
          <h1>
            {errorText !== null
              ? `Ошибка: ${errorText}, попробуйте позже`
              : null}
          </h1>
        </div>

        {newTracks.map((track) => {

          return (
            <S.Playlist__item key={track.id} >
              <S.Playlist__track
                onClick={(e) => {

                  e.preventDefault();
                  setPlayerOn('');
                  e.stopPropagation()
                  dispatch(setTrackRedux({ track, tracks }))

                }}
              >
                <S.Track__title>
                  <S.Track__titleImage >
                    {contentVisible ? (<>

                      <S.Playlist__titleSvg_dot_Pause style={track.id === activeTrackRedux.id & playerOnDot === false ? {
                        display: 'block'
                      } : { display: 'none' }}></S.Playlist__titleSvg_dot_Pause>
                      <S.Playlist__titleSvg_dot style={track.id === activeTrackRedux.id & playerOnDot === true ? { display: 'block' } : { display: 'none' }}></S.Playlist__titleSvg_dot>

                      <S.Track__titleSvg style={track.id === activeTrackRedux.id ? {
                        display: 'none'
                      } : {}} alt="music">
                        <use xlinkHref="img/icon/sprite.svg#icon-note"></use>
                        <use href={`${sprite}#icon-note`} />
                      </S.Track__titleSvg>
                    </>

                    ) : (
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <S.Skeleton_square />
                      </SkeletonTheme>
                    )}
                  </S.Track__titleImage>
                  <S.Track_titleText>
                    <S.Track__titleLink

                      className="trackNameLink"
                      href="http://"
                    >
                      {contentVisible ? (
                        <span>{track.name}</span>
                      ) : (
                        <SkeletonTheme
                          baseColor="#202020"
                          highlightColor="#444"
                        >
                          <S.Skeleton_line />
                        </SkeletonTheme>
                      )}
                      <S.Track__titleSpan></S.Track__titleSpan>
                    </S.Track__titleLink>
                  </S.Track_titleText>
                </S.Track__title>
                <S.Track__author>
                  <S.Track__authorLink href="http://">
                    {contentVisible ? (
                      <span>{track.author}</span>
                    ) : (
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <S.Skeleton_line />
                      </SkeletonTheme>
                    )}
                  </S.Track__authorLink>
                </S.Track__author>
                <S.Track__album>
                  <S.Track__albumLink href="http://">
                    {contentVisible ? (
                      <span>{track.album}</span>
                    ) : (
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <S.Skeleton_line />
                      </SkeletonTheme>
                    )}
                  </S.Track__albumLink>
                </S.Track__album>
                <S.Track_time>
                  {contentVisible ? (
                    <S.Track__timeSvg onClick={(e) => {
                      e.stopPropagation();
                      likes(track) !== track.id ? renderLikes(track.id) : renderDisLikes(track.id);
                    }
                    } alt="time">
                      {/* LIKES */}
                      <use xlinkHref="img/icon/sprite.svg#icon-like"></use>
                      <use style={{ zIndex: '1000' }} href={
                        likes(track) === track.id ? `${sprite}#icon-like-liked` : `${sprite}#icon-like`
                      } />
                    </S.Track__timeSvg>
                  ) : (
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                      <S.Skeleton_lineMini />
                    </SkeletonTheme>
                  )}
                  {contentVisible ? (
                    <S.Track__timeText>
                      {track.duration_in_seconds}
                    </S.Track__timeText>
                  ) : (
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                      <S.Skeleton_displayNo />
                    </SkeletonTheme>
                  )}
                </S.Track_time>
              </S.Playlist__track>
            </S.Playlist__item>
          );
        })}
      </S.CentralBlockContentPlaylist>
    </S.CentralBlockContent>
  );
}