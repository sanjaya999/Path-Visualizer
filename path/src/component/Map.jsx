import React from 'react'
import { useEffect, useRef, useState } from "react";
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "deck.gl";
import { TripsLayer } from "@deck.gl/geo-layers";
import { INITIAL_VIEW_STATE,MAP_STYLE,INITIAL_COLORS } from './services/config';
import { Keyboard } from '@mui/icons-material';
import useSmoothStateChange from '../hooks/selectionRadiusOpacity';
import start  from '../algo/Pathfinding.js';


function Map() {
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [tripsData, setTripsData] = useState([]);
    const [selectionRadius, setSelectionRadius] = useState([]);
    const [started, setStarted] = useState();
    const [loading, setLoading] = useState(false);
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [fadeRadiusReverse, setFadeRadiusReverse] = useState(false);
    const [colors, setColors] = useState(INITIAL_COLORS);
    const [time, setTime] = useState(0);
    const [animationEnded, setAnimationEnded] = useState(false);
    const [playbackOn, setPlaybackOn] = useState(false);
    const [settings, setSettings] = useState({ algorithm: "Dijkstra", radius: 4, speed: 5 });


    const fadeRadius = useRef();
    const ui = useRef();
    const state = useRef(new PathfindingState());


    function startPathfinding() {
        setTimeout(() => {
          clearPath();
          start(settings.algorithm);  
          setStarted(true);
        }, 400);
      }
  
      const handleNextStep = useCallback(() => {
        const updatedNodes = nextStep();
        if (updatedNodes.length === 0) {
            setAnimationEnded(true);
        }
        setTripsData(prevTripsData => [...prevTripsData, ...updatedNodes]);
    }, []);

  return (
    <>
        <div>
            <DeckGL 
             initialViewState={viewState}
             controller = {{doubleClickZoom: false, Keyboard: false}}
             >
                <PolygonLayer 
                id={"Selection-radius"}
                data={selectionRadius}
                pickable={true}
                stroked={true}
                getPolygon={d => d.contour}
                getFillColor={[80, 210, 0, 10]}
                getLineColor={[9, 142, 46, 175]}
                getLineWidth={3}
                opacity={selectionRadiusOpacity}

                />

                <TripsLayer 
                id={"pathfinding-layer"}
                data={tripsData}
                opacity={1}
                widthMinPixels={2}
                widthMaxPixels={5}
                fadeTrail={false}
                currentTime={time}
                getColor={d => colors[d.color]}
                updateTriggers={{
                getColor: [colors.path, colors.route]
                }}
                />

                <ScatterplotLayer 
                id="start-end-points"
                date ={[
                    ...(startNode?[{coordinates:[startNode.lon , startNode.lat],color:colors.startNodeFill , lineColor: colors.startNodeBorder}]: []),
                    ...(endNode?[{coordinates:[endNode.lon , endNode.lat],color:colors.endNodeFill , lineColor: colors.endNodeBorder}]: [])
                ]}
                pickable={true}
                opacity={true}
                stroked={true}
                filled={true}
                radiusScale={1}
                radiusMinPixels={7}
                radiusMaxPixels={20}
                lineWidthMinPixels={1}
                lineWidthMaxPixels={3}
                getPosition={d=> d.coordinates}
                getFillColor={d=> d.color}
                getLineColor={d=> d.lineColor}
                />

                <MapGL 
                reuseMaps mapLib={maplibregl}
                mapStyle={MAP_STYLE}
                doubleClickZoom={false}
                />

            </DeckGL>

            <Interface 
            ref={ui}
            canStart={startNode && startNode}
            started = {started}
            animationEnded={animationEnded}
            playbackOn={playbackOn}
            time={time}
            startPathfinding={startPathfinding}

            />
        </div>
    </>
)
}

export default Map