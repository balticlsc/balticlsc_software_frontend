//const module_name_2_module = new Map()
const module_ID_2_module = new Map()
const diagramElementID_2_CalInstance = new Map()

import {getModuleDefinitionByID} from "./CallableUnitDefinitions.js"


function getCalnstanceCorrespondingTo( diagramElementID ){
    return diagramElementID_2_CalInstance.get( diagramElementID )
}


function addDiagramLevelPinsToComputationApp(diagramm_data, computation_app){
    //console.log("addPinsToComputationApp")
    for(let i=0; i < diagramm_data.boxes.length; i++){
        let box = diagramm_data.boxes[i]
        if( box.elementTypeId == "RequiredDataPin" || box.elementTypeId == "ProvidedDataPin"){
            //console.log(box)
            let pin_binding = ""
            if( box.elementTypeId == "RequiredDataPin"){
                pin_binding = "DataBinding.required_strong"
            }else if(box.elementTypeId == "ProvidedDataPin"){
                pin_binding = "DataBinding.provided"
            }
            let declaredDataPin = {
                name: box.compartments[0].value,
                uuid:"", //TODO : kur to atrast ?
                binding: pin_binding,
                multiplicity:"" //TODO : kur to atrast ?
            }
            diagramElementID_2_CalInstance.set(box.id, declaredDataPin)
            computation_app.declared_pins.push(declaredDataPin)
        }
    }
}

// function addPinsToModule(diagramm_data, box, module){
//     //console.log("printing box pins")
//     for(let pinInd=0; pinInd < diagramm_data.ports.length; pinInd++){
//         let pin = diagramm_data.ports[pinInd]
//         if( box.id == pin.parentId){
//             console.log(pin)
//             let pin_binding = ""
//             if( pin.style.elementStyle.shape == "PortOut"){
//                 pin_binding = "DataBinding.provided"
//             }else if(pin.style.elementStyle.shape == "PortIn"){
//                 pin_binding = "DataBinding.required_strong"
//             }
//             let declaredDataPin = {
//                 name: pin.compartments[0].value,
//                 uuid:"",
//                 binding: pin_binding,
//                 multiplicity:"" 
//             }
//             module.declared_pins.push(declaredDataPin)
//         }
//     }
// }

function addPinsToCall(diagramm_data, box, unit_call){
    //for every pin on this box create ComputedDataPin
    for(let i=0; i < diagramm_data.ports.length; i++){
        let pin = diagramm_data.ports[i]
        
        if( pin.parentId == box.id ){//if this pin is connected to the box we are processing now
            //get DeclaredPinByID
            
            let declared_pin_uid = null
            if(pin.data != ""){
                let d = JSON.parse(pin.data)
                declared_pin_uid = d.declared_pin_uid
            }

            let decl_pin = null
            //find pin in unit_call.unit.declared_pins by declared_pin_uid
            for(let i=0; i < unit_call.unit.declared_pins.length; i++){
                let curr_decl_pin = unit_call.unit.declared_pins[i]
                if(curr_decl_pin.uid == declared_pin_uid){
                    decl_pin = curr_decl_pin
                }
            }

            const computedDataPin = {
                uid: "", //TODO ?
                declared: decl_pin
            }
            diagramElementID_2_CalInstance.set(pin.id, computedDataPin)
            unit_call.pins.push( computedDataPin )

        }
    }
}

function createUnitCalls(diagramm_data, computation_app) {
    //let module_name = ""
    //for each box, get type , depending on type - call processing func
    for (let i = 0; i < diagramm_data.boxes.length; i++) {
        let box = diagramm_data.boxes[i]
        //console.log("box : ", box)
        let unit_call = null
        if(box.elementTypeId != "RequiredDataPin" && box.elementTypeId != "ProvidedDataPin") {
            //console.log("Processing a call ")            
            //create unit call
            let module_uid = null
            if( box.data ){
                const data = JSON.parse(box.data)
                module_uid = data.callable_unit_uid
            }
            unit_call = {
                name: box.compartments[0].value,
                binding: "",// TODO ?
                unit: module_ID_2_module.get(module_uid),
                pins:[]
            }
            addPinsToCall(diagramm_data,box, unit_call)
            //console.log(unit_call)

            diagramElementID_2_CalInstance.set(box.id,unit_call)
            computation_app.calls.push(unit_call)
        }
    }
}

// function createModules(diagramm_data){
//     let module_name = "";

//     //create modules
//     for(let i=0; i < diagramm_data.boxes.length; i++){
//       let box = diagramm_data.boxes[i]
//       const types_to_ignore = ["RequiredDataPin","ProvidedDataPin"]
//       //box.elementTypeId ir call1 vai call2, vai kas cits ko var izsaukt; bet ne RequiredDataPin un ProvideDataPin        
//       let shouldProcess = ! (types_to_ignore.includes(box.elementTypeId))  
//       if( shouldProcess ){
//         //console.log("adding")
//         //console.log(box.elementTypeId)
//         if(box.elementTypeId == "Call3"){
//             console.log("Call3aa")
//             console.log(box)
//             const data = JSON.parse(box.data)
//             console.log(data)
//             const module_uid = data.callable_unit_uid
//             console.log(module_uid)
//         }
//         module_name = box.compartments[1].value;
//         if( ! module_name_2_module.has(module_name)){
//             let module = {
//                 name:module_name,
//                 uuid : "",
//                 image_ref : "",
//                 declared_pins:[],
//             }        
//             module_name_2_module.set(module_name, module)
//             addPinsToModule(diagramm_data, box, module)
//         }
//       }
//     }
//     console.log("module_name_2_module:")
//     console.log(module_name_2_module)
// }


function collectDefinitionsOfReferencedModules(diagramm_data){
    
    const referencedModuleIDs = new Set()
    //collect module ID`s used in this diagram
    for(let i=0; i < diagramm_data.boxes.length; i++){
      let box = diagramm_data.boxes[i]
      const types_to_ignore = ["RequiredDataPin","ProvidedDataPin"]
      //box.elementTypeId ir call1 vai call2, vai kas cits ko var izsaukt; bet ne RequiredDataPin un ProvideDataPin        
      let shouldProcess = ! (types_to_ignore.includes(box.elementTypeId))  
      if( shouldProcess ){
        //console.log("adding")
        //console.log(box.elementTypeId)
        
        //console.log("Processing Call")
        //console.log(box)
        if(box.data){
            const data = JSON.parse(box.data)
            //console.log(data)
            const module_uid = data.callable_unit_uid
            //console.log(module_uid)
            
            referencedModuleIDs.add(module_uid)
        }
      }
    }

    //for each referenced module ID recieve its definition from backend
    //for now we just simulate this API call by calling local function getModuleDefinitionByID
    // eslint-disable-next-line no-cond-assign
    for (let it = referencedModuleIDs.values(), currModuleID = null; currModuleID = it.next().value; ) {
        //console.log("referenced module id " + currModuleID);
        const module = getModuleDefinitionByID(currModuleID)
        module_ID_2_module.set( currModuleID, module )
    }
    
    //console.log("module_ID_2_module:", module_ID_2_module)
}

// function createPinGroups(diagramm_data, computation_app){

// }

function createDataFlows(diagram_data, computation_app){
    for(let i=0; i < diagram_data.lines.length ; i++){
        let line = diagram_data.lines[i]
        //TODO: should we check that line.start and line end are legal ? It is they are required data pin or provided data pin  or port on a box
        let startCalInstance = getCalnstanceCorrespondingTo(line.startElement)
        let endCalInstance = getCalnstanceCorrespondingTo(line.endElement)
        if(startCalInstance != null && endCalInstance != null){
            let dataFlow = {
                source : startCalInstance,
                target : endCalInstance
            }
            
            startCalInstance.outgoing = dataFlow
            endCalInstance.incoming = dataFlow

            computation_app.flows.push(dataFlow)
        }
    }
}

export function generateCALMMInstance1(diagram_data){
    console.log("diagram data ", diagram_data)
    const computation_app = {
      name : diagram_data.name,
      uid : "",//TODO ?
      calls : [],
      declared_pins : [],
      flows : [],
    }

    //sort box compartments by id
    for(let i=0; i < diagram_data.boxes.length; i++){
      let box = diagram_data.boxes[i]
      box.compartments.sort(
        (a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
    }

    //sort port compartments by id
    for(let i=0; i < diagram_data.ports.length; i++){
        let port = diagram_data.ports[i]
        port.compartments.sort(
            (a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
    }
    
    addDiagramLevelPinsToComputationApp(diagram_data, computation_app)
    collectDefinitionsOfReferencedModules(diagram_data)

    createUnitCalls(diagram_data, computation_app)
    //createPinGroups(diagramm_data, computation_app)
    createDataFlows(diagram_data, computation_app)

    console.log("CAL Instance : ", computation_app)
  }
