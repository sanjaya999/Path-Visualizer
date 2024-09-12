import { createPathfindingAlgorithm, nextStep  } from "./algorithm/PathfAlgo";



let state = {
    endNode : null,
    graph : null,
    finished : false,
    algorithm : new createPathfindingAlgorithm()
}

function getStartNode(){
    return state.graph?.startNode;
}

function getNode(id){
    return state.graph?.getNode(id);
}

function reset(){
    state.finished = false;
    if(!state.graph) return;
    for(const key of state.graph.nodes.keys()){
        state.graph.nodes.get(key).reset();
    }
}

export default function  start(algorithm){
    reset();
    switch(algorithm){
        case "dijkstra":
            state.algorithm = new Dijkstra();
            break;

        case "greedy":
            state.algorithm = new Greedy();
            break;
        
        default:
            state.algorithm = new Dijkstra();
            break;
    }

    state.algorithm.start(getStartNode(), state.endNode);
}


function nextStep(){
    const updatedNodes = state.algorithm.nextStep();
    if(state.algorithm.finished || updatedNodes.length === 0) { 
        state.finished = true;
        
    }
    return updatedNodes;

}

export { getStartNode, getNode, reset, nextStep  };
