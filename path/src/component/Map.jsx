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

    const fadeRadius = useRef();

    
    
    const selectionRadiusOpacity= useSmoothStateChange(0,0,1,400,fadeRadius.current , fadeRadiusReverse)

         

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
                
                />

                <MapGL 
                reuseMaps mapLib={maplibregl}
                mapStyle={MAP_STYLE}
                doubleClickZoom={false}
                />

            </DeckGL>

            <div>
            </div>
        </div>
    </>
)
}

export default Map